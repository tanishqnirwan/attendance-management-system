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

    // Ensure teacher exists
    let teacher = await prisma.teacher.findUnique({
      where: {
        id: session.user.id
      }
    })

    if (!teacher) {
      teacher = await prisma.teacher.create({
        data: {
          id: session.user.id,
          name: session.user.user_metadata.name || 'Unknown Teacher',
          email: session.user.email!
        }
      })
    }

    // Get all subjects with their courses and enrollment status
    const subjects = await prisma.subject.findMany({
      include: {
        course: true,
        teachers: {
          where: {
            teacherId: session.user.id
          }
        }
      }
    })

    // Transform the data to include enrollment status
    const formattedSubjects = subjects.map((subject: { id: any; name: any; code: any; course: { id: any; name: any; code: any }; teachers: string | any[] }) => ({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      course: {
        id: subject.course.id,
        name: subject.course.name,
        code: subject.course.code
      },
      enrolled: subject.teachers.length > 0
    }))

    return NextResponse.json(formattedSubjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
} 