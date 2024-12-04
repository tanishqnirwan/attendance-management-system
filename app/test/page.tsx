"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'

interface UserFormData {
  email: string
  password: string
  name: string
  role: 'student' | 'teacher'
  enrollment?: string
  employeeId?: string
}

export default function RegisterPage() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const userData: UserFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
      role: role,
    }

    // Add role-specific IDs
    if (userData.role === 'student') {
      userData.enrollment = formData.get('identifier') as string
    } else {
      userData.employeeId = formData.get('identifier') as string
    }

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select()
        .eq('email', userData.email)
        .single()

      if (existingUser) {
        throw new Error('User already registered')
      }

      // Create new user
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            ...(userData.role === 'student' 
              ? { enrollment: userData.enrollment }
              : { employeeId: userData.employeeId }
            )
          }
        }
      })

      if (error) throw error

      // Check if we got both user and session (indicates email confirmation is disabled)
      if (data?.user && data?.session) {
        setMessage(`${userData.role} account created and verified successfully!`)
      } else if (data?.user) {
        setMessage(`${userData.role} account created. Email verification required.`)
      }

      e.currentTarget.reset()
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as 'student' | 'teacher')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="identifier">
                {role === 'student' ? 'Enrollment Number' : 'Employee ID'}
              </Label>
              <Input
                id="identifier"
                name="identifier"
                placeholder={role === 'student' ? 'Enter enrollment number' : 'Enter employee ID'}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>

            {message && (
              <div className={`mt-4 p-4 rounded text-center ${
                message.startsWith('Error') ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 