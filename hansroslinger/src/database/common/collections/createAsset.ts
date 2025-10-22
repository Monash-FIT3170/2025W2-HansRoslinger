import prisma from "../client";
import { getCollection } from "./getCollection";

export async function createAsset(
  collectionName: string,
  name: string,
  email: string
) {
  try {
    const collection = await getCollection(collectionName, email);
    if (!collection) {
      throw new Error(`Collection with name ${collectionName} for user ${email} not found`);
    }

    const asset = await prisma.asset.create({
      data: {
        name: name,
        collectionID: collection.id
      },    
      select: {
        id: true
      }
    });
    await prisma.collection.update({
      where: { id: collection.id },
      data: { assets: { connect: { id: asset.id } } }
    });

    console.log(`Asset for collection ${collection.id} created:`, asset.id);
    return asset;
  } catch (error) {
    console.error("Error creating asset:", error);
    throw error;
  }
}
