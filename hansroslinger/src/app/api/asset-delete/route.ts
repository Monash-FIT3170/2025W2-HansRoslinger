import { NextRequest, NextResponse } from 'next/server';
import { deleteAsset } from 'database/common/collections/deleteAsset';
import { deleteFile } from 'lib/http/deleteFile';

export async function DELETE(request: NextRequest) {
    try {
        const { assetId, collectionName } = await request.json();
        const email = request.cookies.get("email")?.value || "";

        console.log("Delete asset request:", { assetId, collectionName, email });

        if (!assetId || !collectionName || !email) {
            console.error("Missing required fields:", { assetId, collectionName, email });
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Delete from database using asset ID
        const asset = await deleteAsset(assetId, collectionName, email);
        console.log("Asset deleted from database:", asset);
        
        if (!asset) {
            return NextResponse.json({ error: 'Asset not found or could not be deleted' }, { status: 404 });
        }

        // Delete from S3
        try {
            await deleteFile(email, String(asset.id));
            console.log("Asset deleted from S3");
        } catch (s3Error) {
            console.error("Error deleting from S3:", s3Error);
            // Continue even if S3 deletion fails
        }

        return NextResponse.json(
            { message: "Asset deleted successfully.", asset },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error deleting asset - Full error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to delete asset.";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 },
        );
    }
}

