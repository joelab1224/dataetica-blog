import { NextResponse } from 'next/server';
import { logAdminAction } from '@/lib/errorHandler';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });
  
  // Clear the auth cookie de forma segura
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only secure in production
    sameSite: 'strict',
    maxAge: 0,
    path: '/' // Same path as login cookie
  });
  
  // Log acción administrativa
  logAdminAction('USER_LOGOUT');

  return response;
}
