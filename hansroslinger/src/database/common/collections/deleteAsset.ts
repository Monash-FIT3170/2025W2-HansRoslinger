import prisma from "../client";
import { getCollection } from "./getCollection";

export async function deleteAsset(
  assetName: string,
  collectionName: string,
  email: string,
) {
  try {
    const foundCollection = await getCollection(collectionName, email);
    if (!foundCollection) {
      throw new Error(
        `Collection with name ${collectionName} not found for user ${email}`,
      );
    }
    const asset = await prisma.asset.delete({
      where: {
        collectionID_name: {
          name: assetName,
          collectionID: foundCollection.id,
        },
      },
    });
    return asset;
  } catch (error) {
    console.error("Error deleting asset:", error);
    throw error;
  }
}
