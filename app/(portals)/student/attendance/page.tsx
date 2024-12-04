"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AttendanceRecord {
  subject: {
    id: string
    name: string
    code: string
  }
  total: number
  present: number
  records: {
    date: string
    status: boolean
  }[]
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttendance()
  }, [])

  const loadAttendance = async () => {
    try {
      const response = await fetch('/api/student/attendance')
      const data = await response.json()
      setAttendance(data)
    } catch (error) {
      console.error('Error loading attendance:', error)
      toast.error("Failed to load attendance")
    } finally {
      setLoading(false)
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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Attendance Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attendance.map((record) => (
          <Card key={record.subject.id}>
            <CardHeader>
              <CardTitle>{record.subject.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Present: {record.present}/{record.total} classes</span>
                <span className="font-medium">
                  {Math.round((record.present / record.total) * 100)}%
                </span>
              </div>
              <Progress value={Math.round((record.present / record.total) * 100)} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 