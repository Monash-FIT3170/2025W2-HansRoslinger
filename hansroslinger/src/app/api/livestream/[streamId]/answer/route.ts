import { NextRequest, NextResponse } from "next/server";
import { addAnswer, getStreamSession } from "../../../store";

/**
 * API endpoint to create or update an answer for a specific stream
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { streamId: string } }
) {
  try {
    const { streamId } = params;
    const { peerId, answer } = await req.json();
    
    if (!peerId || !answer) {
      return NextResponse.json(
        { error: "Peer ID and answer are required" },
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
    
    // Add answer to the stream session
    addAnswer(streamId, peerId, answer);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating answer:", error);
    return NextResponse.json(
      { error: "Failed to create answer" },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to get all answers for a specific stream
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { streamId: string } }
) {
  try {
    const { streamId } = params;
    const url = new URL(req.url);
    const peerId = url.searchParams.get("peerId");
    
    // Check if stream exists
    const session = getStreamSession(streamId);
    if (!session) {
      return NextResponse.json(
        { error: "Stream not found" },
        { status: 404 }
      );
    }
    
    // If peer ID is provided, return only that answer
    if (peerId) {
      const answer = session.answers[peerId];
      if (!answer) {
        return NextResponse.json(
          { error: "Answer not found for the specified peer" },
          { status: 404 }
        );
      }
      return NextResponse.json({ peerId, answer });
    }
    
    // Otherwise, return all answers
    const answers = Object.entries(session.answers).map(([peerId, answer]) => ({
      peerId,
      answer,
    }));
    
    return NextResponse.json({ answers });
  } catch (error) {
    console.error("Error getting answers:", error);
    return NextResponse.json(
      { error: "Failed to get answers" },
      { status: 500 }
    );
  }
}