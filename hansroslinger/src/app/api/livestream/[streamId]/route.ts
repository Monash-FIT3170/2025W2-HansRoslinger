import { NextRequest, NextResponse } from "next/server";
import { deleteStreamSession, getStreamSession } from "../store";

/**
 * API endpoint to delete a stream
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { streamId: string } }
) {
  try {
    const { streamId } = params;
    
    // Check if stream exists
    const session = getStreamSession(streamId);
    if (!session) {
      return NextResponse.json(
        { error: "Stream not found" },
        { status: 404 }
      );
    }
    
    // Delete the stream session
    deleteStreamSession(streamId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting stream:", error);
    return NextResponse.json(
      { error: "Failed to delete stream" },
      { status: 500 }
    );
  }
}