"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Users } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Subject {
  id: string
  name: string
  code: string
}

interface Student {
  id: string
  name: string
  enrollment: string
}

interface Course {
  id: string
  name: string
  code: string
  semester: number
  subjects: Subject[]
  students: Student[]
}

export default function ClassesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      const response = await fetch('/api/teacher/classes')
      if (!response.ok) throw new Error('Failed to fetch classes')
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error('Error loading classes:', error)
      toast.error("Failed to load classes")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Classes</h2>
        <p className="text-muted-foreground">
          View and manage your assigned classes
        </p>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold">No classes assigned</h3>
            <p className="text-muted-foreground">
              You have not been assigned any classes yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {course.name}
                  <span className="text-sm font-normal text-muted-foreground">
                    Semester {course.semester}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Subjects</h4>
                    <ul className="mt-2 text-sm text-muted-foreground">
                      {course.subjects.map((subject) => (
                        <li key={subject.id}>{subject.name} ({subject.code})</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students.length} Students
                    </div>
                    <Link href={`/teacher/classes/${course.id}`}>
                      <Button variant="secondary">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 