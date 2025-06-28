import { type NextRequest, NextResponse } from "next/server"

const mockEvaluations = [
  {
    id: "eval_1",
    userId: "7YYBQjndOBTs5LkWc0NyjFbzQai2",
    studentName: "Quách Thành Long",
    studentId: "SV001",
    classId: "CNTT2021A",
    semester: "HK1",
    academicYear: "2023-2024",
    section1: { selfScore: 18, teacherScore: 17, evidence: "Bảng điểm học tập", files: [] },
    section2: { selfScore: 23, teacherScore: 22, evidence: "Không vi phạm nội quy", files: [] },
    section3: { selfScore: 16, teacherScore: 15, evidence: "Tham gia hoạt động đoàn", files: [] },
    section4: { selfScore: 22, teacherScore: 21, evidence: "Tham gia tình nguyện", files: [] },
    section5: { selfScore: 8, teacherScore: 7, evidence: "Làm lớp trưởng", files: [] },
    totalSelfScore: 87,
    finalScore: 82,
    status: "submitted",
    submittedAt: "2024-01-15T00:00:00.000Z",
    teacherComments: "",
  },
  {
    id: "eval_2",
    userId: "student2",
    studentName: "Nguyễn Thị Mai",
    studentId: "SV002",
    classId: "CNTT2021A",
    semester: "HK1",
    academicYear: "2023-2024",
    section1: { selfScore: 19, teacherScore: null, evidence: "Điểm GPA 3.5", files: [] },
    section2: { selfScore: 24, teacherScore: null, evidence: "Không vi phạm", files: [] },
    section3: { selfScore: 18, teacherScore: null, evidence: "Tham gia CLB", files: [] },
    section4: { selfScore: 23, teacherScore: null, evidence: "Hoạt động cộng đồng", files: [] },
    section5: { selfScore: 9, teacherScore: null, evidence: "Bí thư chi đoàn", files: [] },
    totalSelfScore: 93,
    finalScore: null,
    status: "submitted",
    submittedAt: "2024-01-14T00:00:00.000Z",
    teacherComments: "",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const semester = searchParams.get("semester")
    const classId = searchParams.get("classId")

    // Use the same mock data but ensure it's properly structured
    let filteredEvaluations = [...mockEvaluations]

    if (status) {
      filteredEvaluations = filteredEvaluations.filter((evaluation) => evaluation.status === status)
    }

    if (semester) {
      filteredEvaluations = filteredEvaluations.filter((evaluation) => evaluation.semester === semester)
    }

    if (classId) {
      filteredEvaluations = filteredEvaluations.filter((evaluation) => evaluation.classId === classId)
    }

    return NextResponse.json({
      success: true,
      evaluations: filteredEvaluations,
      total: filteredEvaluations.length,
    })
  } catch (error) {
    console.error("Get evaluations for grading error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get evaluations",
        evaluations: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { evaluationId, grades, comments } = await request.json()

    if (!evaluationId || !grades) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find evaluation
    const evaluationIndex = mockEvaluations.findIndex((evaluation) => evaluation.id === evaluationId)

    if (evaluationIndex === -1) {
      return NextResponse.json({ error: "Evaluation not found" }, { status: 404 })
    }

    // Update grades
    const evaluation = mockEvaluations[evaluationIndex]
    evaluation.section1.teacherScore = grades.section1 || evaluation.section1.teacherScore
    evaluation.section2.teacherScore = grades.section2 || evaluation.section2.teacherScore
    evaluation.section3.teacherScore = grades.section3 || evaluation.section3.teacherScore
    evaluation.section4.teacherScore = grades.section4 || evaluation.section4.teacherScore
    evaluation.section5.teacherScore = grades.section5 || evaluation.section5.teacherScore

    // Calculate final score
    evaluation.finalScore =
      (evaluation.section1.teacherScore || 0) +
      (evaluation.section2.teacherScore || 0) +
      (evaluation.section3.teacherScore || 0) +
      (evaluation.section4.teacherScore || 0) +
      (evaluation.section5.teacherScore || 0)

    evaluation.status = "graded"
    evaluation.teacherComments = comments || ""
    evaluation.gradedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      evaluation,
    })
  } catch (error) {
    console.error("Grade evaluation error:", error)
    return NextResponse.json({ error: "Failed to grade evaluation" }, { status: 500 })
  }
}
