import { NextRequest, NextResponse } from "next/server";
import { addOffer, getStreamSession } from "../store";

/**
 * API endpoint to create or update an offer for a specific stream
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { streamId: string } }
) {
  try {
    const { streamId } = params;
    const { peerId, offer } = await req.json();
    
    if (!peerId || !offer) {
      return NextResponse.json(
        { error: "Peer ID and offer are required" },
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
    
    // Add offer to the stream session
    addOffer(streamId, peerId, offer);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to get all offers for a specific stream
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
    
    // If peer ID is provided, return only that offer
    if (peerId) {
      const offer = session.offers[peerId];
      if (!offer) {
        return NextResponse.json(
          { error: "Offer not found for the specified peer" },
          { status: 404 }
        );
      }
      return NextResponse.json({ peerId, offer });
    }
    
    // Otherwise, return all offers
    const offers = Object.entries(session.offers).map(([peerId, offer]) => ({
      peerId,
      offer,
    }));
    
    return NextResponse.json({ offers });
  } catch (error) {
    console.error("Error getting offers:", error);
    return NextResponse.json(
      { error: "Failed to get offers" },
      { status: 500 }
    );
  }
}