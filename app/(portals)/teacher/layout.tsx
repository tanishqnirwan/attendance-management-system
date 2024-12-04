import { Metadata } from "next"
import { TeacherSidebar } from "@/components/teacher/sidebar"
import { LogoutButton } from "@/components/logout-button"

export const metadata: Metadata = {
  title: "Teacher Portal - Attendance Management System",
  description: "Teacher portal for managing student attendance",
}

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen">
      <div className="h-16 border-b flex items-center justify-between px-4">
        <h1 className="text-xl font-bold">GGSIPU Attendance System</h1>
        <LogoutButton />
      </div>
      <div className="flex h-[calc(100vh-4rem)]">
        <TeacherSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 