import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';

import { CustomJwtPayload } from '@/types/jwt';

export function authenticate(req: NextRequest): CustomJwtPayload | null {
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

export function requireAdmin(req: NextRequest) {
    const user = authenticate(req);
    if (!user) {
        return { authorized: false, status: 401, error: 'Unauthorized', user: null };
    }
    if (user.role !== 'admin') {
        return { authorized: false, status: 403, error: 'Forbidden. Admin access required.', user };
    }
    return { authorized: true, user };
}
