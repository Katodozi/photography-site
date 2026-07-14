import { NextResponse } from 'next/server';
import { getCookieName, getAuthCookieOptions } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(getCookieName(), '', { ...getAuthCookieOptions(), maxAge: 0 });
  return response;
}
