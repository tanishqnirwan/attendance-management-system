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

    // Get all courses that have subjects taught by this teacher
    const courses = await prisma.course.findMany({
      where: {
        subjects: {
          some: {
            teachers: {
              some: {
                teacherId: session.user.id
              }
            }
          }
        }
      },
      include: {
        subjects: {
          where: {
            teachers: {
              some: {
                teacherId: session.user.id
              }
            }
          },
          include: {
            teachers: {
              where: {
                teacherId: session.user.id
              }
            }
          }
        },
        students: {
          select: {
            id: true,
            name: true,
            enrollment: true
          }
        }
      }
    })

    // Define types for the response data
    type FormattedStudent = {
      id: string;
      name: string | null;
      enrollment: string;
    }

    type FormattedSubject = {
      id: string;
      name: string;
      code: string;
    }

    type FormattedCourse = {
      id: string;
      name: string;
      code: string;
      semester: string;
      subjects: FormattedSubject[];
      students: FormattedStudent[];
    }

    // Format the response with proper typing
    const formattedCourses: FormattedCourse[] = courses.map((course: { id: any; name: any; code: any; semester: any; subjects: any[]; students: any }) => ({
      id: course.id,
      name: course.name,
      code: course.code,
      semester: course.semester,
      subjects: course.subjects.map((subject: { id: any; name: any; code: any }) => ({
        id: subject.id,
        name: subject.name,
        code: subject.code
      })),
      students: course.students
    }))

    return NextResponse.json(formattedCourses)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
} 