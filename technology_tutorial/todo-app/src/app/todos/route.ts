import { NextResponse } from 'next/server';

const todos: string[] = [];

export async function GET() {
  return NextResponse.json({ todos });
}

export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid todo' }, { status: 400 });
  }
  todos.push(text);
  return NextResponse.json({ success: true, todos });
}

export async function DELETE(req: Request) {
  const { index } = await req.json();
  if (typeof index !== 'number' || index < 0 || index >= todos.length) {
    return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
  }
  todos.splice(index, 1);
  return NextResponse.json({ success: true, todos });
}