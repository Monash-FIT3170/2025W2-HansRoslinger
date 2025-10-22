import prisma from "../client";
import { getCollection } from "./getCollection";

export async function createAsset(collectionID: number, name: string) {
  try {
    const asset = await prisma.asset.create({
      data: {
        name: name,
        collectionID: collectionID,
      },
      select: {
        id: true,
      },
    });
    await prisma.collection.update({
      where: { id: collectionID },
      data: { assets: { connect: { id: asset.id } } },
    });

    console.log(`Asset for collection ${collectionID} created:`, asset.id);
    return asset;
  } catch (error) {
    console.error("Error creating asset:", error);
    throw error;
  }
}
