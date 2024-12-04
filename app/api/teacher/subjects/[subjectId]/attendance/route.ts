import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { subjectId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    if (!date) {
      return new NextResponse('Date parameter is required', { status: 400 })
    }

    // Define types for the response data
    type Student = {
      id: string;
      name: string | null;
      enrollment: string;
    }

    type AttendanceMap = {
      [key: string]: boolean;
    }

    // Define a type for attendance records
    type AttendanceRecord = {
      studentId: string;
      status: boolean;
    }

    // Get all students in the subject's course
    const students: Student[] = await prisma.student.findMany({
      where: {
        course: {
          subjects: {
            some: {
              id: params.subjectId,
              teachers: {
                some: {
                  teacherId: session.user.id
                }
              }
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        enrollment: true,
      }
    })

    // Get today's attendance if exists
    const attendance: AttendanceRecord[] = await prisma.attendance.findMany({
      where: {
        subjectId: params.subjectId,
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
        }
      }
    })

    // Create attendance map
    const attendanceMap: AttendanceMap = attendance.reduce((acc: AttendanceMap, curr: AttendanceRecord) => {
      acc[curr.studentId] = curr.status
      return acc
    }, {} as AttendanceMap)

    return NextResponse.json({
      students,
      attendance: attendanceMap
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 