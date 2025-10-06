import prisma from "../client";


export async function deleteCollection(name: string, email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error(`User with email ${email} not found`);
    }
    const collection = await prisma.collection.findUnique({ where: { authorID_name:{ name: name, authorID: user.id} } });
    if (!collection) {
        throw new Error(`Collection with name ${name} not found`);
    }
    return await prisma.collection.delete({
        where: { id: collection.id },
        select: { id: true, name: true }
    });
}
