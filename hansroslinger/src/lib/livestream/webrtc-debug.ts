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
    console.log("Broadcaster created with ID:", this.peerId);
  }

  /**
   * Start a new livestream and return the stream ID
   */
  async startStream(stream: MediaStream): Promise<string> {
    this.stream = stream;
    this.streamId = uuidv4();
    console.log("Starting stream with ID:", this.streamId);
    
    try {
      this.ws = new WebSocket("ws://localhost:3001");
      
      this.ws.onopen = () => {
        console.log("WebSocket connection established");
        if (this.ws && this.streamId) {
          console.log("Sending join message for stream:", this.streamId);
          this.ws.send(JSON.stringify({ 
            type: "join", 
            streamId: this.streamId,
            role: "broadcaster"
          }));
        }
      };
      
      this.ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received message:", data.type, data.signalType || '');
          
          // Handle a new viewer joining the stream
          if (data.type === "join" && data.role === "viewer") {
            console.log("New viewer joined:", data.peerId);
            this.createPeerConnection(data.peerId);
            
            // Update viewer count if callback is set
            if (this.onViewerCountChange) {
              this.onViewerCountChange(this.peerConnections.size);
            }
          }
          // Handle answer from viewer
          else if (data.type === "signal" && data.signalType === "answer") {
            console.log("Received answer from viewer:", data.peerId);
            const pc = this.peerConnections.get(data.peerId);
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
              console.log("Set remote description from answer");
            }
          }
          // Handle ICE candidate from viewer
          else if (data.type === "signal" && data.signalType === "candidate") {
            console.log("Received ICE candidate from viewer");
            const pc = this.peerConnections.get(data.peerId);
            if (pc && data.candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
              console.log("Added ICE candidate");
            }
          }
        } catch (error) {
          console.error("Error handling message:", error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      
      this.ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
      
      return this.streamId;
    } catch (error) {
      console.error("Error starting stream:", error);
      throw error;
    }
  }

  /**
   * Stop the current livestream
   */
  async stopStream(): Promise<void> {
    console.log("Stopping stream");
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN && this.streamId) {
        this.ws.send(JSON.stringify({ 
          type: "end",
          streamId: this.streamId
        }));
      }
      this.ws.close();
      this.ws = null;
    }
    
    // Close all peer connections
    this.peerConnections.forEach((pc, peerId) => {
      console.log("Closing peer connection to:", peerId);
      pc.close();
    });
    
    this.peerConnections.clear();
    this.streamId = null;
    this.stream = null;
    
    // Update viewer count to 0
    if (this.onViewerCountChange) {
      this.onViewerCountChange(0);
    }
  }

  /**
   * Set a callback for when the viewer count changes
   */
  setViewerCountCallback(callback: (count: number) => void): void {
    this.onViewerCountChange = callback;
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
      console.log("Creating peer connection for viewer:", viewerPeerId);
      const pc = new RTCPeerConnection(iceServers);
      this.peerConnections.set(viewerPeerId, pc);
      
      // Add all tracks from the stream to the peer connection
      this.stream.getTracks().forEach((track) => {
        console.log("Adding track to peer connection:", track.kind);
        pc.addTrack(track, this.stream!);
      });
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && this.ws) {
          console.log("Sending ICE candidate to viewer:", viewerPeerId);
          this.ws.send(
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
      
      pc.oniceconnectionstatechange = () => {
        console.log("ICE connection state change:", pc.iceConnectionState);
      };
      
      // Create and send offer
      const offer = await pc.createOffer();
      console.log("Created offer:", offer.type);
      await pc.setLocalDescription(offer);
      console.log("Set local description from offer");
      
      if (this.ws) {
        console.log("Sending offer to viewer:", viewerPeerId);
        this.ws.send(
          JSON.stringify({
            type: "signal",
            signalType: "offer",
            peerId: viewerPeerId,
            offer: pc.localDescription,
            streamId: this.streamId,
          })
        );
      }
    } catch (error) {
      console.error("Error creating peer connection:", error);
      this.peerConnections.delete(viewerPeerId);
    }
  }
}