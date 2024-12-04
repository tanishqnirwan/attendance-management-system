"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/teacher",
  },
  {
    label: "Take Attendance",
    icon: Calendar,
    href: "/teacher/take-attendance",
  },
  {
    label: "My Classes",
    icon: GraduationCap,
    href: "/teacher/classes",
  },
  {
    label: "Students",
    icon: Users,
    href: "/teacher/students",
  },
  {
    label: "Subjects",
    icon: BookOpen,
    href: "/teacher/subjects",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/teacher/settings",
  },
]

export function TeacherSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background md:block w-64">
      <ScrollArea className="h-full py-6">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">Teacher Portal</h2>
          <p className="text-sm text-muted-foreground">
            Manage your classes and attendance
          </p>
        </div>
        <Separator className="my-4" />
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === route.href && "bg-secondary"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}