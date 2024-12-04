import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'


export default async function TeacherDashboard() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return null

  const teacherData = await prisma.teacher.findUnique({
    where: { id: session.user.id },
    include: {
      subjects: {
        include: {
          subject: {
            include: {
              course: true
            }
          }
        }
      }
    }
  })

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Welcome back, {teacherData?.name}</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {teacherData?.subjects.map(({ subject }: { subject: {
                  code: ReactNode
                  course: any
                  id: string
                  name: string 
} }) => (
                <div key={subject.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {subject.course.name}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {subject.code}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/teacher/take-attendance" className="block">
              <Button className="w-full" variant="secondary">
                Take Attendance
              </Button>
            </Link>
            <Link href="/teacher/classes" className="block">
              <Button className="w-full" variant="secondary">
                View Classes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 