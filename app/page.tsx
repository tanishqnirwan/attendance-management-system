import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header/Navigation Area */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/uni.png"
              alt="GGSIPU Logo"
              width={60}
              height={60}
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Guru Gobind Singh Indraprastha University</h1>
              <p className="text-sm text-gray-600">Attendance Management System</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link href="/teacher/login">
              <Button variant="ghost" size="sm">Teacher Portal</Button>
            </Link>
            <Link href="/student/login">
              <Button variant="ghost" size="sm">Student Portal</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              GGSIPU Attendance Management System
            </h2>
            <p className="text-gray-600">
              Official attendance tracking platform for GGSIPU students and faculty members
            </p>
          </div>

          {/* Portal Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="border rounded-lg p-6 bg-gray-50">
              <h3 className="text-xl font-semibold mb-4">Faculty Portal</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Take and manage class attendance</li>
                <li>• View attendance reports</li>
                <li>• Manage course schedules</li>
                <li>• Generate attendance summaries</li>
              </ul>
              <Link href="/teacher/login">
                <Button className="w-full">Access Faculty Portal</Button>
              </Link>
            </div>

            <div className="border rounded-lg p-6 bg-gray-50">
              <h3 className="text-xl font-semibold mb-4">Student Portal</h3>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• View attendance records</li>
                <li>• Check attendance percentage</li>
                <li>• Access course information</li>
                <li>• Track attendance status</li>
              </ul>
              <Link href="/student/login">
                <Button className="w-full">Access Student Portal</Button>
              </Link>
            </div>
          </div>

          {/* Notice Section */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
            <p className="font-semibold mb-2">Important Notice:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>As per university guidelines, minimum 75% attendance is mandatory for all courses</li>
              <li>Faculty members are required to update attendance within 24 hours of the class</li>
              <li>Students can view their attendance status through the student portal</li>
              <li>For technical support, please contact the university IT department</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Guru Gobind Singh Indraprastha University. All rights reserved.</p>
          <p>Sector 16C, Dwarka, New Delhi-110078</p>
          <p>For technical support: support@ipu.ac.in</p>
        </div>
      </footer>
    </main>
  );
}