import { type NextRequest, NextResponse } from "next/server"

// Mock student data
const mockStudents = [
  {
    id: "1",
    uid: "7YYBQjndOBTs5LkWc0NyjFbzQai2",
    email: "sinhvien@demo.com",
    fullName: "Quách Thành Long",
    studentId: "SV001",
    classId: "CNTT2021A",
    phone: "0123456789",
    role: "student",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    uid: "student2",
    email: "student2@demo.com",
    fullName: "Nguyễn Thị Mai",
    studentId: "SV002",
    classId: "CNTT2021A",
    phone: "0987654321",
    role: "student",
    createdAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    uid: "student3",
    email: "student3@demo.com",
    fullName: "Trần Văn Nam",
    studentId: "SV003",
    classId: "CNTT2021B",
    phone: "0111222333",
    role: "student",
    createdAt: "2024-01-03T00:00:00.000Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const search = searchParams.get("search")

    let filteredStudents = mockStudents

    if (classId) {
      filteredStudents = filteredStudents.filter((student) => student.classId === classId)
    }

    if (search) {
      filteredStudents = filteredStudents.filter(
        (student) =>
          student.fullName.toLowerCase().includes(search.toLowerCase()) ||
          student.studentId.toLowerCase().includes(search.toLowerCase()) ||
          student.email.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({
      success: true,
      students: filteredStudents,
      total: filteredStudents.length,
    })
  } catch (error) {
    console.error("Get students error:", error)
    return NextResponse.json({ error: "Failed to get students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, studentId, classId, phone } = await request.json()

    if (!email || !fullName || !studentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newStudent = {
      id: Date.now().toString(),
      uid: `student_${Date.now()}`,
      email,
      fullName,
      studentId,
      classId: classId || "CNTT2021A",
      phone: phone || "",
      role: "student",
      createdAt: new Date().toISOString(),
    }

    // In real app, save to Firestore
    mockStudents.push(newStudent)

    return NextResponse.json({
      success: true,
      student: newStudent,
    })
  } catch (error) {
    console.error("Add student error:", error)
    return NextResponse.json({ error: "Failed to add student" }, { status: 500 })
  }
}
