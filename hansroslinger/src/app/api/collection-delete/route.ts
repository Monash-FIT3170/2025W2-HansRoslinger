import { NextRequest, NextResponse } from 'next/server';
import { deleteCollection } from 'database/common/collections/deleteCollection';
import { deleteS3Folder } from 'lib/http/deleteFolder';
import { getUser } from 'database/common/user/getUser';

export async function DELETE(request: NextRequest) {
    try {
        const { name } = await request.json();
        const email = request.cookies.get("email")?.value || "";
        if (!name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const collection = await deleteCollection(name, email);
        const user = await getUser(email);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        await deleteS3Folder(String(collection.id), user.email);

        return NextResponse.json({ message: 'Collection deleted successfully.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete collection.' }, { status: 500 });
    }
}