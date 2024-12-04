import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Define a type for the subject
type Subject = {
  name: string;
  code: string;
  attendance: { status: boolean }[];
};

export default async function StudentDashboard() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return null

  const studentData = await prisma.student.findUnique({
    where: { id: session.user.id },
    include: {
      course: {
        include: {
          subjects: {
            include: {
              attendance: {
                where: {
                  studentId: session.user.id
                }
              }
            }
          }
        }
      }
    }
  })

  // Calculate attendance percentages
  const subjectAttendance = studentData?.course?.subjects.map((subject: Subject) => ({
    name: subject.name,
    code: subject.code,
    percentage: subject.attendance.length > 0
      ? (subject.attendance.filter(a => a.status).length / subject.attendance.length) * 100
      : 0
  }))

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Welcome back, {studentData?.name}
      </h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Course</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{studentData?.course?.name}</p>
            <p className="text-sm text-muted-foreground">
              {studentData?.course?.code}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectAttendance?.map((subject: { name: string; code: string; percentage: number }) => (
              <div key={subject.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{subject.name}</p>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(subject.percentage)}%
                  </span>
                </div>
                <Progress value={subject.percentage} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 