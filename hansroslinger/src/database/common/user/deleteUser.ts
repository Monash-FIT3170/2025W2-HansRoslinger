import prisma from '../client';

export async function deleteUser(userId: number) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    console.log('User deleted:', deletedUser);
    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
