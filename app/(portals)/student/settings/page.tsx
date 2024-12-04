"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface StudentProfile {
  name: string
  email: string
  enrollment: string
  course: {
    name: string
    code: string
  } | null
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/student/profile')
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error("Failed to load profile")
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
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={profile?.name} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile?.email} disabled />
          </div>
          <div className="space-y-2">
            <Label>Enrollment Number</Label>
            <Input value={profile?.enrollment} disabled />
          </div>
          <div className="space-y-2">
            <Label>Current Course</Label>
            <Input 
              value={profile?.course ? `${profile.course.name} (${profile.course.code})` : 'Not Enrolled'} 
              disabled 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 