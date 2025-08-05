import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUser } from '../../../database/common/user/getUser';

export type LoginResponse = {
    success: boolean;
    error?: string;
};
export async function POST(req: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const { email, password } = await req.json();
    const user = await getUser(email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials'},
        { status: 401 }
      );
    }

  (await cookies()).set({
    name: 'email',
    value: email,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
