import prisma from '../client';

export async function updateUserEmail(userId: number, newEmail: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });
    console.log('Email updated:', user);
    return user;
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
}
