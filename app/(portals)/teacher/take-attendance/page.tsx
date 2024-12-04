"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, CalendarIcon, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Subject = {
  id: string
  name: string
  code: string
  course: {
    name: string
  }
}

type Student = {
  id: string
  name: string
  enrollment: string
}

export default function TakeAttendancePage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [students, setStudents] = useState<(Student & { present: boolean })[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    loadSubjects()
  }, [])

  useEffect(() => {
    if (selectedSubject && selectedDate) {
      loadStudents(selectedSubject)
    }
  }, [selectedSubject, selectedDate])

  const loadSubjects = async () => {
    try {
      const response = await fetch('/api/teacher/subjects/enrolled')
      const { data } = await response.json()
      setSubjects(data.map((item: any) => item.subject))
    } catch (error) {
      console.error('Error loading subjects:', error)
      toast.error("Failed to load subjects")
    } finally {
      setLoading(false)
    }
  }

  const loadStudents = async (subjectId: string) => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/teacher/subjects/${subjectId}/attendance?date=${selectedDate.toISOString()}`
      )
      const data = await response.json()
      
      setStudents(data.students.map((student: Student) => ({ 
        ...student, 
        present: data.attendance[student.id] ?? false 
      })))
    } catch (error) {
      console.error('Error loading students:', error)
      toast.error("Failed to load students")
    } finally {
      setLoading(false)
    }
  }

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value)
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setSubmitError(null)
      const attendance = students.map(student => ({
        studentId: student.id,
        status: student.present,
      }))

      const response = await fetch('/api/teacher/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjectId: selectedSubject,
          date: selectedDate,
          attendance,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit attendance')
      }

      setSubmitted(true)
      toast.success("Attendance submitted successfully", {
        description: `Recorded for ${format(selectedDate, "MMMM d, yyyy")}`,
      })

      // Show success state for 2 seconds before resetting
      setTimeout(() => {
        setSubmitted(false)
        setSelectedSubject("")
        setStudents([])
      }, 2000)
    } catch (error: any) {
      console.error('Error submitting attendance:', error)
      setSubmitError(error.message)
      toast.error("Failed to submit attendance")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSelectAll = (value: boolean) => {
    setStudents(prev => prev.map(student => ({ ...student, present: value })))
  }

  if (loading && !students.length) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Take Attendance</h2>
        <p className="text-muted-foreground">
          Select a subject and date to manage attendance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Subject & Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedSubject} onValueChange={handleSubjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name} ({subject.course.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {selectedSubject && (
          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>Mark Attendance</CardTitle>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {format(selectedDate, "MMMM d, yyyy")}
                </p>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSelectAll(true)}
                  >
                    Mark All Present
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSelectAll(false)}
                  >
                    Mark All Absent
                  </Button>
                </div>
              </div>
              {submitError && (
                <Alert variant="destructive">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {students.map((student) => (
                    <div 
                      key={student.id} 
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.enrollment}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`present-${student.id}`}
                          checked={student.present}
                          onCheckedChange={(value) => {
                            setStudents(prev =>
                              prev.map(s =>
                                s.id === student.id
                                  ? { ...s, present: value as boolean }
                                  : s
                              )
                            )
                          }}
                        />
                        <Label htmlFor={`present-${student.id}`}>Present</Label>
                      </div>
                    </div>
                  ))}
                </div>

                {students.length > 0 && (
                  <Button 
                    className="w-full relative" 
                    onClick={handleSubmit}
                    disabled={submitting || submitted}
                  >
                    {submitted ? (
                      <span className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Submitted Successfully
                      </span>
                    ) : submitting ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      'Submit Attendance'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 