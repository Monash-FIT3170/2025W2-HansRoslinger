import { v4 as uuidv4 } from "uuid";

/**
 * Configuration for WebRTC ICE servers
 * These are public STUN servers for NAT traversal
 */
const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

/**
 * Class to handle WebRTC streaming as a broadcaster (the streamer)
 */
export class Broadcaster {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private stream: MediaStream | null = null;
  private streamId: string | null = null;
  private peerId: string;
  private ws: WebSocket | null = null;
  private onViewerCountChange: ((count: number) => void) | null = null;

  constructor() {
    // Generate a unique peer ID for this broadcaster
    this.peerId = `broadcaster-${uuidv4()}`;
  }

  /**
   * Start a new livestream and return the stream ID
   */
  async startStream(stream: MediaStream): Promise<string> {
    this.stream = stream;
    this.streamId = uuidv4();
    this.ws = new WebSocket("ws://localhost:3001");
    this.ws.onopen = () => {
      this.ws?.send(JSON.stringify({ type: "join", streamId: this.streamId }));
    };
    this.ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "signal" && data.signalType === "answer") {
        const { peerId, answer } = data;
        const pc = this.peerConnections.get(peerId);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } else if (data.type === "signal" && data.signalType === "candidate") {
        const { peerId, candidate } = data;
        const pc = this.peerConnections.get(peerId);
        if (pc && candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } else if (data.type === "viewer-join") {
        // New viewer joined, create peer connection
        this.createPeerConnection(data.peerId);
      }
    };
    return this.streamId;
  }

  /**
   * Stop the current livestream
   */
  async stopStream(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    this.streamId = null;
    this.stream = null;
  }

  /**
   * Set a callback for when the viewer count changes
   */
  setViewerCountCallback(callback: (count: number) => void): void {
    this.onViewerCountChange = callback;
  }

  /**
   * Check for new viewers every few seconds
   */
  private async pollForViewers(): Promise<void> {
    if (!this.streamId) return;

    try {
      // Get all answers from the server
      const response = await fetch(`/api/livestream/${this.streamId}/answer`);
      
      if (!response.ok) {
        console.error("Failed to get answers");
        return;
      }
      
      const data = await response.json();
      const answers = data.answers || [];
      
      // Process new answers (new viewers)
      for (const { peerId, answer } of answers) {
        // Skip if we already have a connection for this peer
        if (this.peerConnections.has(peerId)) {
          continue;
        }
        
        // Create a new peer connection
        await this.createPeerConnection(peerId, answer);
      }
      
      // Update viewer count
      if (this.onViewerCountChange) {
        this.onViewerCountChange(this.peerConnections.size);
      }
      
      // Poll again after 3 seconds
      setTimeout(() => this.pollForViewers(), 3000);
    } catch (error) {
      console.error("Error polling for viewers:", error);
      
      // Try again after a delay
      setTimeout(() => this.pollForViewers(), 3000);
    }
  }

  /**
   * Create a peer connection for a new viewer
   */
  private async createPeerConnection(viewerPeerId: string): Promise<void> {
    if (!this.stream || !this.streamId || !this.ws) {
      console.error("No stream or signaling available");
      return;
    }
    try {
      const pc = new RTCPeerConnection(iceServers);
      this.peerConnections.set(viewerPeerId, pc);
      this.stream.getTracks().forEach((track) => {
        pc.addTrack(track, this.stream!);
      });
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          this.ws?.send(
            JSON.stringify({
              type: "signal",
              signalType: "candidate",
              peerId: viewerPeerId,
              candidate: event.candidate,
              streamId: this.streamId,
            })
          );
        }
      };
      // Create offer and send to viewer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this.ws.send(
        JSON.stringify({
          type: "signal",
          signalType: "offer",
          peerId: viewerPeerId,
          offer,
          streamId: this.streamId,
        })
      );
    } catch (error) {
      console.error(`Error creating peer connection for viewer ${viewerPeerId}:`, error);
      this.peerConnections.delete(viewerPeerId);
    }
  }

  /**
   * Poll for ICE candidates from a specific peer
   */
  private async pollForIceCandidates(peerId: string, pc: RTCPeerConnection): Promise<void> {
    if (!this.streamId) return;

    try {
      // Get ICE candidates from the server
      const response = await fetch(
        `/api/livestream/${this.streamId}/ice-candidate?peerId=${peerId}`
      );
      
      if (!response.ok) {
        console.error("Failed to get ICE candidates");
        return;
      }
      
      const data = await response.json();
      const candidates = data.candidates || [];
      
      // Add each ICE candidate to the peer connection
      for (const candidate of candidates) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
      
      // Poll again after a delay
      setTimeout(() => this.pollForIceCandidates(peerId, pc), 2000);
    } catch (error) {
      console.error("Error polling for ICE candidates:", error);
      
      // Try again after a delay
      setTimeout(() => this.pollForIceCandidates(peerId, pc), 2000);
    }
  }
}

/**
 * Class to handle WebRTC streaming as a viewer
 */
export class Viewer {
  private peerConnection: RTCPeerConnection | null = null;
  private streamId: string;
  private peerId: string;
  private onStreamCallback: ((stream: MediaStream) => void) | null = null;

  constructor(streamId: string) {
    this.streamId = streamId;
    // Generate a unique peer ID for this viewer
    this.peerId = `viewer-${uuidv4()}`;
  }

  /**
   * Start viewing a livestream
   */
  async startViewing(): Promise<void> {
    try {
      // Create a new peer connection
      this.peerConnection = new RTCPeerConnection(iceServers);
      
      // Handle incoming tracks
      this.peerConnection.ontrack = (event) => {
        if (this.onStreamCallback) {
          this.onStreamCallback(event.streams[0]);
        }
      };
      
      // Handle ICE candidates
      this.peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          try {
            await fetch(`/api/livestream/${this.streamId}/ice-candidate`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                peerId: this.peerId,
                candidate: event.candidate,
              }),
            });
          } catch (error) {
            console.error("Error sending ICE candidate:", error);
          }
        }
      };
      
      // Poll for broadcasters
      this.pollForBroadcasters();
    } catch (error) {
      console.error("Error starting to view stream:", error);
      throw error;
    }
  }

  /**
   * Stop viewing the livestream
   */
  stopViewing(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }

  /**
   * Set a callback for when the stream is received
   */
  onStream(callback: (stream: MediaStream) => void): void {
    this.onStreamCallback = callback;
  }

  /**
   * Poll for broadcasters to connect to
   */
  private async pollForBroadcasters(): Promise<void> {
    try {
      // Get all offers from the server
      const response = await fetch(`/api/livestream/${this.streamId}/offer`);
      
      if (!response.ok) {
        console.error("Failed to get offers");
        setTimeout(() => this.pollForBroadcasters(), 3000);
        return;
      }
      
      const data = await response.json();
      const offers = data.offers || [];
      
      // Find a broadcaster to connect to
      if (offers.length > 0 && this.peerConnection) {
        const { peerId, offer } = offers[0]; // Use the first broadcaster
        
        // Set remote description from broadcaster's offer
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        
        // Create an answer
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        
        // Send the answer to the server
        await fetch(`/api/livestream/${this.streamId}/answer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            peerId: this.peerId,
            answer,
          }),
        });
        
        // Get and apply ICE candidates from the broadcaster
        this.pollForIceCandidates(peerId);
      } else {
        // Try again after a delay
        setTimeout(() => this.pollForBroadcasters(), 3000);
      }
    } catch (error) {
      console.error("Error polling for broadcasters:", error);
      
      // Try again after a delay
      setTimeout(() => this.pollForBroadcasters(), 3000);
    }
  }

  /**
   * Poll for ICE candidates from a specific peer
   */
  private async pollForIceCandidates(peerId: string): Promise<void> {
    if (!this.peerConnection) return;

    try {
      // Get ICE candidates from the server
      const response = await fetch(
        `/api/livestream/${this.streamId}/ice-candidate?peerId=${peerId}`
      );
      
      if (!response.ok) {
        console.error("Failed to get ICE candidates");
        return;
      }
      
      const data = await response.json();
      const candidates = data.candidates || [];
      
      // Add each ICE candidate to the peer connection
      for (const candidate of candidates) {
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
      
      // Poll again after a delay
      setTimeout(() => this.pollForIceCandidates(peerId), 2000);
    } catch (error) {
      console.error("Error polling for ICE candidates:", error);
      
      // Try again after a delay
      setTimeout(() => this.pollForIceCandidates(peerId), 2000);
    }
  }
}