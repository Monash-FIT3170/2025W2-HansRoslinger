import prisma from "../client";
export async function getSelectedCollections(userID: number) {
  try {
    const selectedCollections = await prisma.collection.findMany({
      where: {
        isSelected: true,
        authorID: userID,
      },
      include: {
        assets: true, // optional: include assets in the collection
      },
    });
    return selectedCollections;
  } catch (error) {
    console.error("Error fetching selected collections:", error);
    throw error;
  }
}
