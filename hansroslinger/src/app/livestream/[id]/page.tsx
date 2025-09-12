"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ViewerPage = ({ params }: { params: { id: string } }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let peerConnection: RTCPeerConnection | null = null;
    let ws: WebSocket | null = null;
    let stream: MediaStream | null = null;

    const startViewing = async () => {
      try {
        ws = new WebSocket(
          `${window.location.protocol === "https:" ? "wss" : "ws"}://$${window.location.host}/api/livestream/view?id=${params.id}`
        );
        ws.onopen = () => {
          ws?.send(JSON.stringify({ type: "viewer-join", streamId: params.id }));
        };
        ws.onmessage = async (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "offer") {
            peerConnection = new RTCPeerConnection({
              iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
                { urls: "stun:stun2.l.google.com:19302" },
              ],
            });
            peerConnection.ontrack = (event) => {
              if (!stream) {
                stream = new window.MediaStream();
                if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                }
              }
              stream.addTrack(event.track);
            };
            peerConnection.onicecandidate = (e) => {
              if (e.candidate) {
                ws?.send(
                  JSON.stringify({
                    type: "candidate",
                    candidate: e.candidate,
                  })
                );
              }
            };
            await peerConnection.setRemoteDescription(data.offer);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            if (ws) {
              ws.send(
                JSON.stringify({
                  type: "answer",
                  answer,
                })
              );
            }
          } else if (data.type === "candidate" && peerConnection) {
            await peerConnection.addIceCandidate(data.candidate);
          } else if (data.type === "end") {
            setError("The stream has ended.");
            if (ws) ws.close();
            peerConnection?.close();
          }
        };
        ws.onerror = () => {
          setError("Failed to connect to the stream.");
        };
        ws.onclose = () => {
          setLoading(false);
        };
      } catch (err) {
        setError("Could not connect to the stream.");
      }
    };
    startViewing();
    return () => {
      ws?.close();
      peerConnection?.close();
    };
  }, [params.id]);

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
