import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { requireAdmin } from '@/middleware/auth';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const adminCheck = requireAdmin(req);
    if (!adminCheck.authorized) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const statusFilter = searchParams.get('status');

    const skip = (page - 1) * limit;

    const query: any = {};
    if (statusFilter === 'active' || statusFilter === 'blocked') {
      query.status = statusFilter;
    }

    const users = await User.find(query)
      .select('-password_hash')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      users,
      totalCount,
      currentPage: page,
      totalPages,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Admin get users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
