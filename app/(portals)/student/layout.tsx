import { Metadata } from "next"
import { LogoutButton } from "@/components/logout-button"
import { Sidebar } from "@/components/student/sidebar"
import { TopBar } from "@/components/student/top-bar"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Student Portal - Attendance Management System",
  description: "Student portal for managing attendance",
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8">
          <Toaster />
          {children}
        </main>
      </div>
    </div>
  )
} 