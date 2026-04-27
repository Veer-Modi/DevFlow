import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

export function signToken(payload: string | object | Buffer): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '1h' });
}

import { CustomJwtPayload } from '@/types/jwt';

export function verifyToken(token: string): CustomJwtPayload {
  const decoded = jwt.verify(token, getJwtSecret());
  if (typeof decoded === "string") {
    throw new Error("Invalid token format");
  }
  return decoded as CustomJwtPayload;
}
