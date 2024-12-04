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

    const attendance = await prisma.attendance.findMany({
      where: {
        studentId: session.user.id,
        subjectId: params.subjectId
      },
      orderBy: {
        date: 'desc'
      }
    })

    const total = attendance.length
    const present = attendance.filter((a: { status: any }) => a.status).length
    const percentage = total > 0 ? (present / total) * 100 : 0

    return NextResponse.json({
      total,
      present,
      percentage,
      records: attendance
    })
  } catch (error) {
    console.error('Error fetching subject attendance:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 