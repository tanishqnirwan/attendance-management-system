"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Course {
  id: string
  name: string
  code: string
  semester: number
}

interface Subject {
  id: string
  name: string
  code: string
  course: Course
  enrolled: boolean
  studentCount?: number
}

interface GroupedSubjects {
  [key: string]: Subject[]
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
      setSubjects(data)
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

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setSubjects(prev =>
        prev.map(subject =>
          subject.id === subjectId
            ? { ...subject, enrolled: data.enrolled }
            : subject
        )
      )

      toast.success(
        data.enrolled ? "Successfully enrolled" : "Successfully unenrolled"
      )
    } catch (error) {
      console.error('Error updating enrollment:', error)
      toast.error("Failed to update enrollment")
    } finally {
      setEnrolling(null)
    }
  }

  // Group subjects by course
  const groupedSubjects = subjects.reduce((acc: GroupedSubjects, subject) => {
    const key = subject.course.name
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(subject)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Subjects</h2>
        <p className="text-muted-foreground">
          View and manage your subject enrollments
        </p>
      </div>
      <Tabs defaultValue={Object.keys(groupedSubjects)[0]} className="space-y-6">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
            {Object.keys(groupedSubjects).map((courseName) => (
              <TabsTrigger
                key={courseName}
                value={courseName}
                className="relative h-12 rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground"
              >
                {courseName}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {Object.entries(groupedSubjects).map(([courseName, courseSubjects]) => (
          <TabsContent key={courseName} value={courseName}>
            <div className="space-y-4">
              {courseSubjects.map((subject) => (
                <div 
                  key={subject.id} 
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{subject.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        • Semester {subject.course.semester}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {subject.code}
                    </p>
                  </div>
                  <Button
                    variant={subject.enrolled ? "destructive" : "default"}
                    onClick={() => handleEnrollment(subject.id)}
                    disabled={enrolling === subject.id}
                    size="sm"
                  >
                    {enrolling === subject.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {subject.enrolled ? 'Unenrolling...' : 'Enrolling...'}
                      </>
                    ) : (
                      subject.enrolled ? 'Unenroll' : 'Enroll'
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 