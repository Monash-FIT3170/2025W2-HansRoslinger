import prisma from "../client";

export async function updateS3BucketUrl(
  userId: number,
  newS3BucketUrl: string,
) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { s3BucketUrl: newS3BucketUrl },
    });
    console.log("S3 Data URL updated:", user);
    return user;
  } catch (error) {
    console.error("Error updating S3 Data URL:", error);
    throw error;
  }
}
