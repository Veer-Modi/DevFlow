import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import User from '../../../models/User';
import { hashPassword } from '../../../utils/hash';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { full_name, username, email, password } = body;

    if (!full_name || !username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate password: min 8 chars, at least 1 uppercase, at least 1 number
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one uppercase letter' }, { status: 400 });
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one number' }, { status: 400 });
    }

    // Check if username unique
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
    }

    // Check if email unique
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Save user to DB
    const newUser = new User({
      full_name,
      username,
      email,
      password_hash,
    });

    await newUser.save();

    // Return success + user basic info
    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        full_name: newUser.full_name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
