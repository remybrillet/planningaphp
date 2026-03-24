import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'dev-secret'
)

const protectedPaths = ['/planning', '/agents', '/conges', '/remplacements', '/rapports', '/parametres']
const adminPaths = ['/admin']
const authPaths = ['/login', '/forgot-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  // Check if path is protected
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))
  const isAdmin = adminPaths.some((p) => pathname.startsWith(p))
  const isAuth = authPaths.some((p) => pathname.startsWith(p))

  if (isProtected || isAdmin) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)

      // Check admin access
      if (isAdmin && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/planning', request.url))
      }

      // Add user info to headers
      const response = NextResponse.next()
      response.headers.set('x-user-id', payload.sub as string)
      response.headers.set('x-user-role', payload.role as string)
      return response
    } catch {
      // Invalid token — redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuth && token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.redirect(new URL('/planning', request.url))
    } catch {
      // Token invalid, let them access auth pages
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)',
  ],
}
