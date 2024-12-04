export type UserRole = 'student' | 'teacher'

export interface UserMetadata {
  role: UserRole
  name: string
  enrollment?: string  // for students
  employeeId?: string  // for teachers
} 