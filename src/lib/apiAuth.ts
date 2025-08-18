import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Verifies JWT token and returns authenticated user
 * Throws AuthError if authentication fails
 */
export async function verifyAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    throw new AuthError('No authentication token provided', 401);
  }
  
  try {
    // Verify JWT token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    
    // Fetch fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    
    if (!user) {
      throw new AuthError('User not found', 404);
    }
    
    return user;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    
    // Handle jose library errors
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        throw new AuthError('Authentication token expired', 401);
      }
      if (error.message.includes('signature')) {
        throw new AuthError('Invalid authentication token', 401);
      }
    }
    
    console.error('Authentication error:', error);
    throw new AuthError('Authentication failed', 401);
  }
}

/**
 * Requires admin role access
 */
export async function requireAdmin(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await verifyAuth(request);
  
  if (user.role !== 'ADMIN') {
    throw new AuthError('Admin access required', 403);
  }
  
  return user;
}

/**
 * Higher-order function that wraps API route handlers with authentication
 */
export function withAuth<T extends unknown[]>(
  handler: (request: NextRequest, user: AuthenticatedUser, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const user = await verifyAuth(request);
      return await handler(request, user, ...args);
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          { 
            error: error.message,
            code: error.statusCode === 403 ? 'FORBIDDEN' : 'UNAUTHORIZED'
          },
          { status: error.statusCode }
        );
      }
      
      console.error('Auth wrapper error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Higher-order function that wraps API route handlers with admin authentication
 */
export function withAdminAuth<T extends unknown[]>(
  handler: (request: NextRequest, user: AuthenticatedUser, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const user = await requireAdmin(request);
      return await handler(request, user, ...args);
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          { 
            error: error.message,
            code: error.statusCode === 403 ? 'FORBIDDEN' : 'UNAUTHORIZED'
          },
          { status: error.statusCode }
        );
      }
      
      console.error('Admin auth wrapper error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Utility function for manual auth checks in API routes
 */
export async function authenticateRequest(request: NextRequest): Promise<{
  success: true;
  user: AuthenticatedUser;
} | {
  success: false;
  error: string;
  status: number;
}> {
  try {
    const user = await verifyAuth(request);
    return { success: true, user };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: error.message,
        status: error.statusCode
      };
    }
    
    return {
      success: false,
      error: 'Authentication failed',
      status: 500
    };
  }
}

/**
 * Logs admin actions for audit trail
 */
export function logAdminAction(
  action: string, 
  user: AuthenticatedUser, 
  details?: Record<string, unknown>,
  request?: NextRequest
) {
  const timestamp = new Date().toISOString();
  const ip = request?.headers.get('x-forwarded-for') || 
             request?.headers.get('x-real-ip') || 
             'unknown';
  
  const logEntry = {
    timestamp,
    action,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    ip,
    details: process.env.NODE_ENV === 'development' ? details : undefined
  };
  
  console.log(`[ADMIN_ACTION] ${JSON.stringify(logEntry)}`);
  
  // Future: Save to audit log table
  // await prisma.auditLog.create({ data: logEntry });
}
