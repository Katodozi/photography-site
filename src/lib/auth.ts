import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { SessionPayload } from '@/types';

const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY = '7d';

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) return undefined;
  return value.trim().replace(/^["']|["']$/g, '');
}

function getSecret(): Uint8Array | null {
  const secret = readEnv('ADMIN_SECRET');
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  };
}

export async function signToken(username: string): Promise<string> {
  const secret = getSecret();
  if (!secret) {
    throw new Error('ADMIN_SECRET must be at least 32 characters');
  }

  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  const secret = getSecret();
  if (!secret) return null;

  try {
    const decoded = decodeURIComponent(token);
    const { payload } = await jwtVerify(decoded, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(request?: Request): Promise<SessionPayload | null> {
  let token: string | undefined;

  if (request) {
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/admin_token=([^;]+)/);
      token = match?.[1];
    }
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(COOKIE_NAME)?.value;
  }

  if (!token) return null;
  return verifyToken(token);
}

export function getCookieName() {
  return COOKIE_NAME;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, getAuthCookieOptions());
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { ...getAuthCookieOptions(), maxAge: 0 });
}

export function validateCredentials(username: string, password: string): boolean {
  const adminUser = readEnv('ADMIN_USERNAME');
  const adminPass = readEnv('ADMIN_PASSWORD');

  if (!adminUser || !adminPass) return false;

  return username.trim() === adminUser && password === adminPass;
}
