"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { useState } from 'react'

export default function TestPage() {
  const [message, setMessage] = useState<string>('')
  const supabase = createClientComponentClient()

  const createUsers = async () => {
    try {
      // Create student user
      const { data: studentData, error: studentError } = await supabase.auth.signUp({
        email: 'nishanttanwar4011@gmail.com',
        password: 'nishudon',
        options: {
          data: {
            role: 'student',
            name: 'Nishant Tanwar',
            enrollment: 'STU001'
          }
        }
      })

      if (studentError) throw studentError

      // Create teacher user
      const { data: teacherData, error: teacherError } = await supabase.auth.signUp({
        email: 'tanishq9304@gmail.com',
        password: 'tanishqdon',
        options: {
          data: {
            role: 'teacher',
            name: 'Tanishq',
            employeeId: 'TCH001'
          }
        }
      })

      if (teacherError) throw teacherError

      setMessage('Users created successfully! Check emails for verification.')
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Button onClick={createUsers} className="mb-4">
        Create Test Users
      </Button>
      {message && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          {message}
        </div>
      )}
    </div>
  )
} 