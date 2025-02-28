import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && 
      path !== '/auth/signin' && 
      path !== '/auth/register' &&
      path !== '/auth/error' && 
      !path.startsWith('/api/')) {
    const url = new URL('/auth/signin', request.url);
    return NextResponse.redirect(url);
  }
  
  // If the user is authenticated and trying to access auth pages
  if (isAuthenticated && (path === '/auth/signin' || path === '/auth/register')) {
    // Redirect to home page
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }
  
  // Redirect /dashboard to root for all users
  if (path === '/dashboard') {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}; 