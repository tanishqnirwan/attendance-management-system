import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  GGSIPU Attendance Management System
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  A comprehensive system to manage and track student attendance for Guru Gobind Singh Indraprastha University
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/student/login">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Login as Student
                  </Button>
                </Link>
                <Link href="/teacher/login">
                  <Button size="lg" variant="outline">
                    Login as Teacher
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2024 GGSIPU. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}