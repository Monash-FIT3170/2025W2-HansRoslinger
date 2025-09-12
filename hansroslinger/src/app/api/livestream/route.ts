import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createStreamSession, getStreamSession } from "./store";

/**
 * API endpoint to create a new livestream
 * Returns a unique stream ID
 */
export async function POST(req: NextRequest) {
  try {
    // Generate a unique stream ID
    const streamId = uuidv4();
    
    // Create a new stream session
    createStreamSession(streamId);
    
    // Return the stream ID to the client
    return NextResponse.json({ streamId }, { status: 201 });
  } catch (error) {
    console.error("Error creating stream:", error);
    return NextResponse.json(
      { error: "Failed to create stream" },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to get information about a specific stream
 * Returns stream status
 */
export async function GET(req: NextRequest) {
  try {
    // Extract the stream ID from the URL
    const url = new URL(req.url);
    const streamId = url.searchParams.get("streamId");
    
    if (!streamId) {
      return NextResponse.json(
        { error: "Stream ID is required" },
        { status: 400 }
      );
    }
    
    // Get the stream session
    const session = getStreamSession(streamId);
    
    if (!session) {
      return NextResponse.json(
        { error: "Stream not found" },
        { status: 404 }
      );
    }
    
    // Return stream status
    return NextResponse.json({
      streamId: session.id,
      active: true,
      viewerCount: Object.keys(session.answers).length,
      createdAt: session.createdAt
    });
  } catch (error) {
    console.error("Error getting stream:", error);
    return NextResponse.json(
      { error: "Failed to get stream information" },
      { status: 500 }
    );
  }
}