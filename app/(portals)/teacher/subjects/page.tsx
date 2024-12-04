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
}

interface Subject {
  id: string
  name: string
  code: string
  course: Course
  enrolled: boolean
}

interface EnrollmentResponse {
  enrolled: boolean
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      const response = await fetch('/api/teacher/subjects')
      const data = await response.json()
      setSubjects(data as Subject[])
    } catch (error) {
      console.error('Error loading subjects:', error)
      toast.error("Failed to load subjects")
    } finally {
      setLoading(false)
    }
  }

  const handleEnrollment = async (subjectId: string) => {
    try {
      setEnrolling(subjectId)
      const response = await fetch('/api/teacher/subjects/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjectId }),
      })

      if (!response.ok) throw new Error('Failed to update enrollment')

      const { enrolled } = await response.json() as EnrollmentResponse
      
      // Update local state
      setSubjects(prevSubjects => 
        prevSubjects.map(subject => 
          subject.id === subjectId 
            ? { ...subject, enrolled } 
            : subject
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
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Subjects</h2>
        <p className="text-muted-foreground">
          Enroll in subjects you want to teach
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {subject.name}
                <span className="text-sm font-normal text-muted-foreground">
                  {subject.code}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {subject.course.name} ({subject.course.code})
              </p>
              <Button
                className="w-full"
                variant={subject.enrolled ? "destructive" : "default"}
                onClick={() => handleEnrollment(subject.id)}
                disabled={enrolling === subject.id}
              >
                {enrolling === subject.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {subject.enrolled ? "Unenroll" : "Enroll"}
              </Button>
            </CardContent>
          </Card>
        ))}

        {subjects.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No subjects available
          </div>
        )}
      </div>
    </div>
  )
} 