import prisma from "../client";
export async function setCollectionSelection(
  collectionId: number,
  isSelected: boolean,
) {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
  });
  if (!collection) {
    throw new Error(`Collection with ID ${collectionId} not found`);
  }
  const updatedCollection = await prisma.collection.update({
    where: { id: collectionId },
    data: { isSelected },
  });
  return updatedCollection;
}
