import prisma from "../client";

export async function getUser(emailToFind: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: emailToFind },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
