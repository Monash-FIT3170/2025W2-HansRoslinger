import prisma from "../client";
import { createCollection } from "../collections/createCollection";
import * as crypto from "crypto";

export async function createUser(
  email: string,
  password: string,
  s3BucketUrl: string,
) {
  try {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = await prisma.user.create({
      data: {
        email,
        s3BucketUrl,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    const collection =  await createCollection(email);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        collections: {
          connect: { id: collection.id }
        }
      }
    });
    console.log("User created:", user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
