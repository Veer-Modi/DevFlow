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

export function verifyToken(token: string) {
  return jwt.verify(token, getJwtSecret());
}
