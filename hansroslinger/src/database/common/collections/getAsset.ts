import prisma from "../client";
import { getCollection } from "./getCollection";

export async function getAsset(
  assetName: string,
  collectionName: string,
  userID: number,
) {
  try {
    const foundCollection = await getCollection(collectionName, userID);
    if (!foundCollection) {
      throw new Error(
        `Collection with name ${collectionName} not found for user ${userID}`,
      );
    }
    const asset = await prisma.asset.findUnique({
      where: {
        collectionID_name: {
          name: assetName,
          collectionID: foundCollection.id,
        },
      },
    });
    return asset;
  } catch (error) {
    console.error("Error fetching asset:", error);
    throw error;
  }
}
