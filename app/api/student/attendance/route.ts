import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Add interfaces for type safety
interface AttendanceRecord {
  subjectId: string
  subject: {
    id: string
    name: string
    code: string
  }
  date: Date
  status: boolean
}

interface SubjectAttendanceSummary {
  subject: {
    id: string
    name: string
    code: string
  }
  total: number
  present: number
  records: Array<{
    date: Date
    status: boolean
  }>
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get student's attendance records with subject details
    const attendance = await prisma.attendance.findMany({
      where: {
        studentId: session.user.id
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    }) as AttendanceRecord[]

    // Group attendance by subject
    const subjectAttendance = attendance.reduce<Record<string, SubjectAttendanceSummary>>((acc, record) => {
      const subjectId = record.subjectId
      if (!acc[subjectId]) {
        acc[subjectId] = {
          subject: record.subject,
          total: 0,
          present: 0,
          records: []
        }
      }
      acc[subjectId].total++
      if (record.status) acc[subjectId].present++
      acc[subjectId].records.push({
        date: record.date,
        status: record.status
      })
      return acc
    }, {})

    return NextResponse.json(Object.values(subjectAttendance))
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 