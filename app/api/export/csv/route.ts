import { type NextRequest, NextResponse } from "next/server"

const mockEvaluationData = [
  {
    studentName: "Quách Thành Long",
    studentId: "SV001",
    classId: "CNTT2021A",
    semester: "HK1 2023-2024",
    section1Self: 18,
    section1Teacher: 17,
    section2Self: 23,
    section2Teacher: 22,
    section3Self: 16,
    section3Teacher: 15,
    section4Self: 22,
    section4Teacher: 21,
    section5Self: 8,
    section5Teacher: 7,
    totalSelf: 87,
    finalScore: 82,
    status: "Đã chấm điểm",
    submittedAt: "2024-01-15",
    gradedAt: "2024-01-20",
  },
  {
    studentName: "Nguyễn Thị Mai",
    studentId: "SV002",
    classId: "CNTT2021A",
    semester: "HK1 2023-2024",
    section1Self: 19,
    section1Teacher: 18,
    section2Self: 24,
    section2Teacher: 23,
    section3Self: 18,
    section3Teacher: 17,
    section4Self: 23,
    section4Teacher: 22,
    section5Self: 9,
    section5Teacher: 8,
    totalSelf: 93,
    finalScore: 88,
    status: "Đã chấm điểm",
    submittedAt: "2024-01-14",
    gradedAt: "2024-01-19",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get("semester")
    const classId = searchParams.get("classId")
    const format = searchParams.get("format") || "detailed"

    let filteredData = mockEvaluationData

    if (semester) {
      filteredData = filteredData.filter((item) => item.semester === semester)
    }

    if (classId) {
      filteredData = filteredData.filter((item) => item.classId === classId)
    }

    if (format === "detailed") {
      // Detailed CSV with all sections
      const headers = [
        "Họ tên",
        "MSSV",
        "Lớp",
        "Học kỳ",
        "Học tập (Tự chấm)",
        "Học tập (GV chấm)",
        "Nội quy (Tự chấm)",
        "Nội quy (GV chấm)",
        "Hoạt động XH (Tự chấm)",
        "Hoạt động XH (GV chấm)",
        "Quan hệ CD (Tự chấm)",
        "Quan hệ CD (GV chấm)",
        "Công tác lớp (Tự chấm)",
        "Công tác lớp (GV chấm)",
        "Tổng điểm tự chấm",
        "Điểm cuối cùng",
        "Trạng thái",
        "Ngày nộp",
        "Ngày chấm",
      ]

      const csvRows = [
        headers.join(","),
        ...filteredData.map((item) =>
          [
            `"${item.studentName}"`,
            item.studentId,
            item.classId,
            `"${item.semester}"`,
            item.section1Self,
            item.section1Teacher,
            item.section2Self,
            item.section2Teacher,
            item.section3Self,
            item.section3Teacher,
            item.section4Self,
            item.section4Teacher,
            item.section5Self,
            item.section5Teacher,
            item.totalSelf,
            item.finalScore,
            `"${item.status}"`,
            item.submittedAt,
            item.gradedAt,
          ].join(","),
        ),
      ]

      const csvContent = "\uFEFF" + csvRows.join("\n") // UTF-8 BOM for Excel

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="bao-cao-chi-tiet-${Date.now()}.csv"`,
        },
      })
    } else {
      // Summary CSV
      const headers = ["Họ tên", "MSSV", "Lớp", "Học kỳ", "Điểm cuối cùng", "Xếp loại", "Trạng thái"]

      const csvRows = [
        headers.join(","),
        ...filteredData.map((item) => {
          let classification = "Trung bình"
          if (item.finalScore >= 90) classification = "Xuất sắc"
          else if (item.finalScore >= 80) classification = "Tốt"
          else if (item.finalScore >= 70) classification = "Khá"

          return [
            `"${item.studentName}"`,
            item.studentId,
            item.classId,
            `"${item.semester}"`,
            item.finalScore,
            `"${classification}"`,
            `"${item.status}"`,
          ].join(",")
        }),
      ]

      const csvContent = "\uFEFF" + csvRows.join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="bao-cao-tom-tat-${Date.now()}.csv"`,
        },
      })
    }
  } catch (error) {
    console.error("Export CSV error:", error)
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data, filename, format } = await request.json()

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Process custom data export
    const csvContent =
      "\uFEFF" + data.map((row) => (Array.isArray(row) ? row.map((cell) => `"${cell}"`).join(",") : "")).join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename || "export"}-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error("Custom CSV export error:", error)
    return NextResponse.json({ error: "Failed to export custom CSV" }, { status: 500 })
  }
}
