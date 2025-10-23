import prisma from "../client";
import { getCollection } from "./getCollection";

export async function deleteAsset(
  assetId: number,
  collectionName: string,
  email: string,
) {
  try {
    // First get the user to obtain userID
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const foundCollection = await getCollection(collectionName, user.id);
    if (!foundCollection) {
      throw new Error(
        `Collection with name ${collectionName} not found for user ${email}`,
      );
    }

    // Verify the asset belongs to this collection
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset || asset.collectionID !== foundCollection.id) {
      throw new Error(
        `Asset with id ${assetId} not found in collection ${collectionName}`,
      );
    }

    // Delete the asset
    const deletedAsset = await prisma.asset.delete({
      where: { id: assetId },
    });
    return deletedAsset;
  } catch (error) {
    console.error("Error deleting asset:", error);
    throw error;
  }
}
