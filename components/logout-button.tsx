"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { supabase } from "@/lib/supabase"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  )
} 