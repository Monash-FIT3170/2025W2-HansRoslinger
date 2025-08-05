import prisma from "../client";

export async function createUser(
  email: string,
  password: string,
  s3BucketUrl: string
) {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        s3BucketUrl,
        password,
      },
    });
    console.log("User created:", user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
