import prisma from "../client";

export async function createUser(
  email: string,
  name: string,
  s3BucketUrl: string,
  password: string,
) {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
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
