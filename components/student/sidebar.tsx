"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Home,
  Settings,
} from "lucide-react"

const links = [
  { name: "Dashboard", href: "/student", icon: Home },
  { name: "Courses", href: "/student/enroll", icon: BookOpen },
  { name: "Attendance", href: "/student/attendance", icon: Calendar },
  { name: "Settings", href: "/student/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-56 flex-col border-r bg-muted/10">
      <div className="flex h-14 items-center border-b px-4">
        <GraduationCap className="h-6 w-6" />
        <span className="ml-2 font-semibold">Student Portal</span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-medium",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted/50"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 