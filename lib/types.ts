export interface User {
  uid: string
  email: string
  role: "student" | "teacher"
  fullName: string
  studentId?: string
  classId?: string
  avatar?: string
  phone?: string
  dateOfBirth?: string
  department?: string
  position?: string
  createdAt: string
}

export interface SectionScore {
  selfScore: number
  classScore?: number
  teacherScore?: number
  evidence: string
  files?: string[]
}

export interface Evaluation {
  id?: string
  userId: string
  semester: string
  academicYear: string
  section1: SectionScore // Học tập (20)
  section2: SectionScore // Chấp hành nội quy (25)
  section3: SectionScore // Hoạt động xã hội (20)
  section4: SectionScore // Quan hệ công dân (25)
  section5: SectionScore // Công tác lớp (10)
  totalSelfScore: number
  finalScore?: number
  status: "draft" | "submitted" | "graded"
  submittedAt?: Date
  gradedAt?: Date
  teacherComments?: string
}

export interface Notification {
  id?: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  recipientId?: string
  recipientRole?: "student" | "teacher"
  createdAt: Date
  read: boolean
}

export const SECTION_NAMES = {
  section1: "Học tập",
  section2: "Chấp hành nội quy",
  section3: "Hoạt động xã hội",
  section4: "Quan hệ công dân",
  section5: "Công tác lớp",
}

export const SECTION_MAX_SCORES = {
  section1: 20,
  section2: 25,
  section3: 20,
  section4: 25,
  section5: 10,
}
