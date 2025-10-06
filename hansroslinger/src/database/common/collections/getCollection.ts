import prisma from "../client";
import { getUser } from "../user/getUser";

export async function getCollection(collectionToFind: string, email: string) {
  try {
    const user = await getUser(email);
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    const collection = await prisma.collection.findUnique({
      where: { authorID_name: {name: collectionToFind, authorID: user.id }},
    });
    return collection;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
