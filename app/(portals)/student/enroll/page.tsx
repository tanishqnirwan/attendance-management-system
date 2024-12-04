"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Course {
  id: string
  name: string
  code: string
  semester: number
  subjects: {
    id: string
    name: string
    code: string
  }[]
  enrolled: boolean
}

export default function EnrollPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const response = await fetch('/api/student/courses')
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error('Error loading courses:', error)
      toast.error("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  const handleEnrollment = async (courseId: string) => {
    try {
      setEnrolling(courseId)
      const response = await fetch('/api/student/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      })

      if (!response.ok) throw new Error('Failed to update enrollment')

      const { enrolled } = await response.json()
      
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId 
            ? { ...course, enrolled } 
            : course
        )
      )

      toast.success(enrolled ? "Successfully enrolled" : "Successfully unenrolled")
    } catch (error) {
      console.error('Error updating enrollment:', error)
      toast.error("Failed to update enrollment")
    } finally {
      setEnrolling(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Code: {course.code}</p>
              <p>Semester: {course.semester}</p>
              <p>Subjects: {course.subjects.length}</p>
              <Button
                variant={course.enrolled ? "destructive" : "default"}
                onClick={() => handleEnrollment(course.id)}
                disabled={enrolling === course.id}
              >
                {enrolling === course.id ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  course.enrolled ? "Unenroll" : "Enroll"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 