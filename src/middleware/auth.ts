import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../utils/jwt';

export function authenticate(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
}
