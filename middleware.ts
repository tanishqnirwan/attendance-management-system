import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { pathname } = req.nextUrl

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth routes - redirect to dashboard if already logged in
  if (pathname.startsWith('/student/login') || pathname.startsWith('/teacher/login')) {
    if (session) {
      const role = session.user.user_metadata.role
      return NextResponse.redirect(new URL(`/${role}`, req.url))
    }
    return res
  }

  // Protected routes
  if (pathname.startsWith('/student') || pathname.startsWith('/teacher')) {
    if (!session) {
      // Redirect to home page if not logged in
      return NextResponse.redirect(new URL('/', req.url))
    }

    const role = session.user.user_metadata.role

    // Prevent students from accessing teacher routes and vice versa
    if (pathname.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL('/teacher', req.url))
    }

    if (pathname.startsWith('/teacher') && role !== 'teacher') {
      return NextResponse.redirect(new URL('/student', req.url))
    }
  }

  return res
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/student/:path*',
    '/teacher/:path*',
  ]
} 