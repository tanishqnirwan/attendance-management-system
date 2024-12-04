"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Search } from "lucide-react"

type Student = {
  id: string
  name: string
  enrollment: string
  course: {
    name: string
    code: string
  }
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState<string>("all")

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const response = await fetch('/api/teacher/students')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error loading students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = courseFilter === "all" || student.course.code === courseFilter
    return matchesSearch && matchesCourse
  })

  const courses = Array.from(new Set(students.map(s => s.course.code)))

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
        <h2 className="text-3xl font-bold tracking-tight">Students</h2>
        <p className="text-muted-foreground">
          View and manage student information
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or enrollment"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map(code => (
              <SelectItem key={code} value={code}>{code}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredStudents.map(student => (
          <Card key={student.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {student.enrollment}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{student.course.code}</p>
                <p className="text-sm text-muted-foreground">
                  {student.course.name}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredStudents.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No students found
          </div>
        )}
      </div>
    </div>
  )
} 