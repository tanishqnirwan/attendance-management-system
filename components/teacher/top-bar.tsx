"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export function TopBar() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="h-14 border-b flex items-center justify-between px-4">
      <h1 className="text-xl font-bold">GGSIPU Attendance System</h1>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleSignOut}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  )
} 