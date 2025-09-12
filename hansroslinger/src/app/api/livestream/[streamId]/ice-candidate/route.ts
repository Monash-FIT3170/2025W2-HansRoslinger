import { NextRequest, NextResponse } from "next/server";
import { addIceCandidate, getStreamSession } from "../../../store";

/**
 * API endpoint to add an ICE candidate for a specific stream
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { streamId: string } }
) {
  try {
    const { streamId } = params;
    const { peerId, candidate } = await req.json();
    
    if (!peerId || !candidate) {
      return NextResponse.json(
        { error: "Peer ID and candidate are required" },
        { status: 400 }
      );
    }
    
    // Check if stream exists
    const session = getStreamSession(streamId);
    if (!session) {
      return NextResponse.json(
        { error: "Stream not found" },
        { status: 404 }
      );
    }
    
    // Add ICE candidate to the stream session
    addIceCandidate(streamId, peerId, candidate);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding ICE candidate:", error);
    return NextResponse.json(
      { error: "Failed to add ICE candidate" },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to get all ICE candidates for a specific stream
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { streamId: string } }
) {
  try {
    const { streamId } = params;
    const url = new URL(req.url);
    const peerId = url.searchParams.get("peerId");
    
    if (!peerId) {
      return NextResponse.json(
        { error: "Peer ID is required" },
        { status: 400 }
      );
    }
    
    // Check if stream exists
    const session = getStreamSession(streamId);
    if (!session) {
      return NextResponse.json(
        { error: "Stream not found" },
        { status: 404 }
      );
    }
    
    // Return ICE candidates for the specified peer
    const candidates = session.iceCandidates[peerId] || [];
    
    return NextResponse.json({ peerId, candidates });
  } catch (error) {
    console.error("Error getting ICE candidates:", error);
    return NextResponse.json(
      { error: "Failed to get ICE candidates" },
      { status: 500 }
    );
  }
}