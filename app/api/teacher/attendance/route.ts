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

    const { subjectId, date, attendance } = await req.json()

    // Verify teacher has access to this subject
    const hasAccess = await prisma.teacherSubject.findFirst({
      where: {
        teacherId: session.user.id,
        subjectId
      }
    })

    if (!hasAccess) {
      return new NextResponse('Unauthorized access to subject', { status: 403 })
    }

    // Create or update attendance records
    const attendanceDate = new Date(date)
    
    // Use transaction to ensure all records are created/updated
    await prisma.$transaction(
      attendance.map((record: { studentId: string, status: boolean }) =>
        prisma.attendance.upsert({
          where: {
            date_studentId_subjectId: {
              date: attendanceDate,
              studentId: record.studentId,
              subjectId
            }
          },
          create: {
            date: attendanceDate,
            studentId: record.studentId,
            subjectId,
            status: record.status
          },
          update: {
            status: record.status
          }
        })
      )
    )

    return NextResponse.json({ message: 'Attendance recorded successfully' })
  } catch (error) {
    console.error('Error recording attendance:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 