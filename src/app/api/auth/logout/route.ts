import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    message: 'Logout successful. Please remove token on client side.'
  }, { status: 200 });
}
