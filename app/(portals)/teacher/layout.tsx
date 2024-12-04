import { Metadata } from "next"
import { TeacherSidebar } from "@/components/teacher/sidebar"
import { TopBar } from "@/components/teacher/top-bar"
import { Toaster } from "sonner"

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
      <TopBar />
      <div className="flex h-[calc(100vh-3.5rem)]">
        <TeacherSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Toaster />
          {children}
        </main>
      </div>
    </div>
  )
} 