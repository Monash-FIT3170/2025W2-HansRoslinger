import prisma from "../client";
export async function getAllCollections(userID: number) {
  try {
    const collections = await prisma.collection.findMany({
      where: { authorID: userID },
    });
    return collections;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
