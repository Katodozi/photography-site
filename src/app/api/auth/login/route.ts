import { NextResponse } from 'next/server';
import {
  signToken,
  validateCredentials,
  getCookieName,
  getAuthCookieOptions,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken(username.trim());

    const response = NextResponse.json({ success: true });
    response.cookies.set(getCookieName(), token, getAuthCookieOptions());
    return response;
  } catch (error) {
    console.error('Login error:', error);
    const message =
      error instanceof Error && error.message.includes('ADMIN_SECRET')
        ? 'Server misconfigured: ADMIN_SECRET must be at least 32 characters'
        : 'Login failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
