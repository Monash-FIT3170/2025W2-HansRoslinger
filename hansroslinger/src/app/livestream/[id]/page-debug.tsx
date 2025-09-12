"use client";

import { use, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ViewerPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("Viewer page mounted, stream ID:", id);
    let peerConnection: RTCPeerConnection | null = null;
    let ws: WebSocket | null = null;
    let stream: MediaStream | null = null;
    let viewerPeerId = `viewer-${Math.random().toString(36).substr(2, 9)}`;

    const startViewing = async () => {
      try {
        console.log("Connecting to WebSocket server");
        ws = new WebSocket("ws://localhost:3001");
        
        ws.onopen = () => {
          console.log("WebSocket connected, joining stream:", id);
          ws?.send(JSON.stringify({ 
            type: "join", 
            streamId: id,
            role: "viewer",
            peerId: viewerPeerId
          }));
        };
        
        ws.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Received message:", data.type, data.signalType || '');
            
            if (data.type === "signal" && data.signalType === "offer") {
              console.log("Received offer from broadcaster");
              
              // Create peer connection if not exists
              if (!peerConnection) {
                console.log("Creating new RTCPeerConnection");
                peerConnection = new RTCPeerConnection({
                  iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" },
                    { urls: "stun:stun2.l.google.com:19302" },
                  ],
                });
                
                peerConnection.ontrack = (event) => {
                  console.log("Received track:", event.track.kind);
                  if (!stream) {
                    stream = new MediaStream();
                    if (videoRef.current) {
                      console.log("Setting stream to video element");
                      videoRef.current.srcObject = stream;
                      setLoading(false);
                    }
                  }
                  stream.addTrack(event.track);
                };
                
                peerConnection.onicecandidate = (e) => {
                  if (e.candidate && ws) {
                    console.log("Sending ICE candidate to broadcaster");
                    ws.send(
                      JSON.stringify({
                        type: "signal",
                        signalType: "candidate",
                        peerId: data.peerId,
                        candidate: e.candidate,
                        streamId: id,
                      })
                    );
                  }
                };
                
                peerConnection.onconnectionstatechange = () => {
                  console.log("Connection state change:", peerConnection?.connectionState);
                };
                
                peerConnection.oniceconnectionstatechange = () => {
                  console.log("ICE connection state change:", peerConnection?.iceConnectionState);
                };
              }
              
              // Set remote description (offer from broadcaster)
              console.log("Setting remote description from offer");
              await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
              
              // Create and send answer
              console.log("Creating answer");
              const answer = await peerConnection.createAnswer();
              console.log("Setting local description from answer");
              await peerConnection.setLocalDescription(answer);
              
              if (ws) {
                console.log("Sending answer to broadcaster");
                ws.send(
                  JSON.stringify({
                    type: "signal",
                    signalType: "answer",
                    peerId: data.peerId,
                    answer,
                    streamId: id,
                  })
                );
              }
            } else if (data.type === "signal" && data.signalType === "candidate" && peerConnection) {
              console.log("Received ICE candidate from broadcaster");
              await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
              console.log("Added ICE candidate");
            } else if (data.type === "end") {
              console.log("Stream has ended");
              setError("The stream has ended.");
              if (ws) ws.close();
              if (peerConnection) peerConnection.close();
            }
          } catch (err) {
            console.error("Error processing message:", err);
          }
        };
        
        ws.onerror = (event) => {
          console.error("WebSocket error:", event);
          setError("Failed to connect to the stream.");
        };
        
        ws.onclose = () => {
          console.log("WebSocket connection closed");
          setLoading(false);
        };
      } catch (err) {
        console.error("Error connecting to stream:", err);
        setError("Could not connect to the stream.");
      }
    };
    
    startViewing();
    
    return () => {
      console.log("Cleaning up viewer resources");
      if (ws) ws.close();
      if (peerConnection) peerConnection.close();
    };
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-3xl aspect-video bg-black border-2 border-gray-700 relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            controls
            className="w-full h-full object-contain bg-black"
            playsInline
          />
        )}
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-lg bg-black bg-opacity-60">
            Loading stream...
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewerPage;