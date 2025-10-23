import prisma from "../client";

export async function getAllAssets(
  collectionID: number
) {
  try {
    const assets = await prisma.asset.findMany({
      where: {
        collectionID: collectionID,
      },
      orderBy: {
        name: "asc",
      },
    });
    return assets;
  } catch (error) {
    console.error("Error fetching asset:", error);
    throw error;
  }
}