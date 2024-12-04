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

    const { courseId } = await req.json()

    // Validate courseId
    if (!courseId) {
      return new NextResponse(JSON.stringify({ error: 'Course ID is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    try {
      // First check if student exists
      let student = await prisma.student.findUnique({
        where: { id: session.user.id },
        include: { course: true }
      })

      if (!student) {
        // Create new student with course connection
        student = await prisma.student.create({
          data: {
            id: session.user.id,
            name: session.user.user_metadata?.name || 'Unknown Student',
            email: session.user.email || '',
            enrollment: `ST${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            course: {
              connect: {
                id: courseId
              }
            }
          },
          include: { course: true }
        })

        return NextResponse.json({ 
          enrolled: true,
          message: 'Successfully created student and enrolled in course',
          course: student.course
        })
      }

      // For existing students, handle enrollment changes
      if (student.course?.id === courseId) {
        // Since course is required, we can't disconnect
        // Instead, return an error
        return new NextResponse(JSON.stringify({ 
          error: 'Cannot unenroll. Students must be enrolled in a course.'
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      } else {
        // Switch to new course
        const updatedStudent = await prisma.student.update({
          where: { id: session.user.id },
          data: { 
            course: {
              connect: {
                id: courseId
              }
            }
          },
          include: { course: true }
        })

        return NextResponse.json({ 
          enrolled: true,
          message: 'Successfully switched course',
          course: updatedStudent.course
        })
      }
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      
      if (dbError.code === 'P2025') {
        return new NextResponse(JSON.stringify({ 
          error: 'Course not found'
        }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new NextResponse(JSON.stringify({ 
        error: 'Database operation failed',
        details: dbError.message
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error: any) {
    console.error('Error handling enrollment:', error)
    return new NextResponse(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 