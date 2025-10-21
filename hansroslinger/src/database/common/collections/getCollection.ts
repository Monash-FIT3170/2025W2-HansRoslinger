import prisma from "../client";

export async function getCollection(collectionToFind: string, userID: number) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { authorID_name: { name: collectionToFind, authorID: userID } },
    });
    return collection;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
