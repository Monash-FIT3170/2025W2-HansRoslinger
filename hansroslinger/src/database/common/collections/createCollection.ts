import prisma from "../client";
import { getUser } from "../user/getUser";

export async function createCollection(
  email: string,
  name: string = "Home",

) {
  try {
    const user = await getUser(email);
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const collection = await prisma.collection.create({
      data: {
        name: name,
        authorID: user.id
      },    
      select: {
        id: true
      }
    });

    console.log(`Collection for ${user.id} created:`, collection.id);
    return collection;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
}
