import prisma from "../client";

export async function createUser(
  email: string,
  password: string,
) {
  try {
    // some logic to generate a unique S3 bucket URL
    const s3BucketUrl = `https://s3.amazonaws.com/${email}-bucket`; //change this to actual logic
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
