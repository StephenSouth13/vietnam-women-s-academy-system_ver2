import { type NextRequest, NextResponse } from "next/server"

const mockStudentData = [
  {
    fullName: "Quách Thành Long",
    studentId: "SV001",
    classId: "CNTT2021A",
    email: "sinhvien@demo.com",
    phone: "0123456789",
    semester: "HK1 2023-2024",
    section1Score: 18,
    section2Score: 23,
    section3Score: 16,
    section4Score: 22,
    section5Score: 8,
    totalScore: 87,
    finalScore: 85,
    status: "Đã chấm điểm",
    submittedAt: "2024-01-15",
    gradedAt: "2024-01-20",
  },
  {
    fullName: "Nguyễn Thị Mai",
    studentId: "SV002",
    classId: "CNTT2021A",
    email: "student2@demo.com",
    phone: "0987654321",
    semester: "HK1 2023-2024",
    section1Score: 19,
    section2Score: 24,
    section3Score: 18,
    section4Score: 23,
    section5Score: 9,
    totalScore: 93,
    finalScore: 90,
    status: "Đã chấm điểm",
    submittedAt: "2024-01-14",
    gradedAt: "2024-01-19",
  },
  {
    fullName: "Trần Văn Nam",
    studentId: "SV003",
    classId: "CNTT2021B",
    email: "student3@demo.com",
    phone: "0111222333",
    semester: "HK1 2023-2024",
    section1Score: 17,
    section2Score: 22,
    section3Score: 15,
    section4Score: 21,
    section5Score: 7,
    totalScore: 82,
    finalScore: 80,
    status: "Đã chấm điểm",
    submittedAt: "2024-01-13",
    gradedAt: "2024-01-18",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const semester = searchParams.get("semester")
    const classId = searchParams.get("classId")

    let filteredData = mockStudentData

    if (semester) {
      filteredData = filteredData.filter((student) => student.semester === semester)
    }

    if (classId) {
      filteredData = filteredData.filter((student) => student.classId === classId)
    }

    if (format === "csv") {
      // Generate CSV with UTF-8 BOM for Excel compatibility
      const headers = [
        "Họ tên",
        "MSSV",
        "Lớp",
        "Email",
        "SĐT",
        "Học kỳ",
        "Điểm học tập",
        "Điểm nội quy",
        "Điểm hoạt động XH",
        "Điểm quan hệ CD",
        "Điểm công tác lớp",
        "Tổng điểm tự chấm",
        "Điểm cuối cùng",
        "Trạng thái",
        "Ngày nộp",
        "Ngày chấm",
      ]

      const csvRows = [
        headers.join(","),
        ...filteredData.map((student) =>
          [
            `"${student.fullName}"`,
            student.studentId,
            student.classId,
            student.email,
            student.phone,
            `"${student.semester}"`,
            student.section1Score,
            student.section2Score,
            student.section3Score,
            student.section4Score,
            student.section5Score,
            student.totalScore,
            student.finalScore,
            `"${student.status}"`,
            student.submittedAt,
            student.gradedAt,
          ].join(","),
        ),
      ]

      const csvContent = "\uFEFF" + csvRows.join("\n") // UTF-8 BOM

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="danh-sach-sinh-vien-${Date.now()}.csv"`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      total: filteredData.length,
    })
  } catch (error) {
    console.error("Export students error:", error)
    return NextResponse.json({ error: "Failed to export students" }, { status: 500 })
  }
}
