import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Add interfaces for type safety
interface Student {
  courseId: string | null
}

interface Course {
  id: string
  name: string
  code: string
  semester: string
  subjects: Array<{
    id: string
    name: string
    code: string
  }>
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get student's current course (if any)
    const student = await prisma.student.findUnique({
      where: { id: session.user.id },
      select: { courseId: true }
    }) as Student | null

    // Get all available courses with their subjects
    const courses = await prisma.course.findMany({
      include: {
        subjects: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    }) as Course[]

    // Format courses with enrollment status
    const formattedCourses = courses.map(course => ({
      id: course.id,
      name: course.name,
      code: course.code,
      semester: course.semester,
      subjects: course.subjects,
      enrolled: course.id === student?.courseId
    }))

    return NextResponse.json(formattedCourses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 