import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isRSCRequest = request.nextUrl.searchParams.has('_rsc');
  
  console.log('Middleware: Path:', pathname, 'RSC Request:', isRSCRequest);
  
  // Allow access to login page
  if (pathname === '/admin/login') {
    console.log('Middleware: Allowing access to login page');
    return NextResponse.next();
  }
  
  // Protect other admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;
    
    console.log('Middleware: Admin route accessed, token present?', !!token);
    
    if (!token) {
      console.log('Middleware: No token, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      console.log('Middleware: JWT_SECRET present?', !!process.env.JWT_SECRET);
      console.log('Middleware: Token starts with:', token.substring(0, 20) + '...');
      
      // Verify token using jose (Edge Runtime compatible)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      
      console.log('Middleware: Token verified, user role:', payload.role);
      
      // Check if user has admin role
      if (payload.role !== 'ADMIN') {
        console.log('Middleware: User not admin, redirecting to login');
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      console.log('Middleware: Access granted to admin route');
    } catch (error) {
      console.log('Middleware: Token verification failed:', error);
      if (error instanceof Error) {
        console.log('Middleware: Error type:', error.constructor.name);
        console.log('Middleware: Error message:', error.message);
      } else {
        console.log('Middleware: Unknown error type:', typeof error);
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
}