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

    const student = await prisma.student.findUnique({
      where: { id: session.user.id },
      include: {
        course: {
          select: {
            name: true,
            code: true
          }
        }
      }
    })

    if (!student) {
      return new NextResponse('Student not found', { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 