import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { comparePassword } from '@/utils/hash';
import { signToken } from '@/utils/jwt';
import { loginRateLimiter } from '@/middleware/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip';
    
    if (!loginRateLimiter(ip)) {
      return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!loginRateLimiter(email)) {
      return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status === 'blocked') {
      return NextResponse.json({ error: 'Account is blocked' }, { status: 403 });
    }

    const isPasswordCorrect = await comparePassword(password, user.password_hash);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
