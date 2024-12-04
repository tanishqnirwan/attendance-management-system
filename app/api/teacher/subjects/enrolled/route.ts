import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const enrolledSubjects = await prisma.teacherSubject.findMany({
      where: {
        teacherId: session.user.id,
      },
      include: {
        subject: {
          include: {
            course: true,
          },
        },
      },
    })

    return NextResponse.json({ data: enrolledSubjects })
  } catch (error) {
    console.error('Error fetching enrolled subjects:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 