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

    // Get all students from courses where the teacher teaches at least one subject
    const students = await prisma.student.findMany({
      where: {
        course: {
          subjects: {
            some: {
              teachers: {
                some: {
                  teacherId: session.user.id
                }
              }
            }
          }
        }
      },
      include: {
        course: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 