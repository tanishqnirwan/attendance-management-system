import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { subjectId } = await req.json()

    // First, ensure the teacher exists in the Teacher table
    let teacher = await prisma.teacher.findUnique({
      where: {
        id: session.user.id
      }
    })

    // If teacher doesn't exist, create them
    if (!teacher) {
      teacher = await prisma.teacher.create({
        data: {
          id: session.user.id,
          name: session.user.user_metadata.name || 'Unknown Teacher',
          email: session.user.email!
        }
      })
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.teacherSubject.findFirst({
      where: {
        teacherId: session.user.id,
        subjectId: subjectId,
      },
    })

    if (existingEnrollment) {
      // Unenroll
      await prisma.teacherSubject.delete({
        where: {
          id: existingEnrollment.id,
        },
      })
      return NextResponse.json({ enrolled: false })
    } else {
      // Enroll
      await prisma.teacherSubject.create({
        data: {
          teacherId: session.user.id,
          subjectId: subjectId,
        },
      })
      return NextResponse.json({ enrolled: true })
    }
  } catch (error) {
    console.error('Error handling enrollment:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
} 