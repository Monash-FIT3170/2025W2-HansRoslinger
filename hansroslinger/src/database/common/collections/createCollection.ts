import prisma from "../client";

export async function createCollection(userID: number, name: string = "Home") {
  try {
    const collection = await prisma.collection.create({
      data: {
        name: name,
        authorID: userID,
      },
      select: {
        id: true,
        name: true,
      },
    });

    console.log(`Collection for ${userID} created:`, collection.id);
    return collection;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
}
