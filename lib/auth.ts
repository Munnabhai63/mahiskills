import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'mahiskills_super_secret_jwt_key_2026_secure_tokens';
export const AUTH_COOKIE_NAME = 'mahiskills_auth_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        bio: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) return null;
    return user;
  } catch {
    return null;
  }
}

export async function requireAuth(allowedRoles: ('STUDENT' | 'ADMIN')[] = ['STUDENT', 'ADMIN']) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Unauthorized. Please login.', status: 401, user: null };
  }
  if (!allowedRoles.includes(user.role as 'STUDENT' | 'ADMIN')) {
    return { error: 'Forbidden. Insufficient permissions.', status: 403, user: null };
  }
  return { error: null, status: 200, user };
}
