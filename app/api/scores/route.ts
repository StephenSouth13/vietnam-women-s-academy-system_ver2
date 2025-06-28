import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const evaluation = await request.json()

    // Validate required fields
    if (!evaluation.userId || !evaluation.semester || !evaluation.academicYear) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate total self score
    const totalSelfScore =
      evaluation.section1.selfScore +
      evaluation.section2.selfScore +
      evaluation.section3.selfScore +
      evaluation.section4.selfScore +
      evaluation.section5.selfScore

    const evaluationData = {
      ...evaluation,
      totalSelfScore,
      submittedAt: evaluation.status === "submitted" ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    }

    // Generate document ID
    const docId = `${evaluation.userId}_${evaluation.semester}_${evaluation.academicYear}`

    // Mock save - in production, this would save to Firestore
    console.log("Mock save evaluation:", docId, evaluationData)

    return NextResponse.json({
      success: true,
      id: docId,
      totalSelfScore,
      message: "Evaluation saved successfully (mock)",
    })
  } catch (error) {
    console.error("Save evaluation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save evaluation",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const semester = searchParams.get("semester")
    const academicYear = searchParams.get("academicYear")

    // Mock evaluation data - replace with actual Firestore calls when ready
    const mockEvaluations = [
      {
        id: "7YYBQjndOBTs5LkWc0NyjFbzQai2_HK1_2023-2024",
        userId: "7YYBQjndOBTs5LkWc0NyjFbzQai2",
        semester: "HK1",
        academicYear: "2023-2024",
        section1: { selfScore: 18, evidence: "Bảng điểm học tập tốt", files: [] },
        section2: { selfScore: 23, evidence: "Không vi phạm nội quy", files: [] },
        section3: { selfScore: 16, evidence: "Tham gia hoạt động đoàn", files: [] },
        section4: { selfScore: 22, evidence: "Tham gia tình nguyện", files: [] },
        section5: { selfScore: 8, evidence: "Làm lớp trưởng", files: [] },
        totalSelfScore: 87,
        finalScore: 85,
        status: "graded",
        submittedAt: new Date("2024-01-15").toISOString(),
        gradedAt: new Date("2024-01-20").toISOString(),
      },
      {
        id: "7YYBQjndOBTs5LkWc0NyjFbzQai2_HK2_2023-2024",
        userId: "7YYBQjndOBTs5LkWc0NyjFbzQai2",
        semester: "HK2",
        academicYear: "2023-2024",
        section1: { selfScore: 0, evidence: "", files: [] },
        section2: { selfScore: 0, evidence: "", files: [] },
        section3: { selfScore: 0, evidence: "", files: [] },
        section4: { selfScore: 0, evidence: "", files: [] },
        section5: { selfScore: 0, evidence: "", files: [] },
        totalSelfScore: 0,
        status: "draft",
        submittedAt: null,
      },
    ]

    if (userId && semester && academicYear) {
      // Get specific evaluation
      const docId = `${userId}_${semester}_${academicYear}`
      const evaluationResult = mockEvaluations.find((mockEval) => mockEval.id === docId)

      if (evaluationResult) {
        return NextResponse.json({
          success: true,
          evaluation: evaluationResult,
        })
      } else {
        return NextResponse.json({
          success: true,
          evaluation: null,
        })
      }
    } else if (userId) {
      // Get all evaluations for user
      const userEvaluations = mockEvaluations.filter((mockEval) => mockEval.userId === userId)

      return NextResponse.json({
        success: true,
        evaluations: userEvaluations,
      })
    } else {
      // Get all evaluations (for teachers)
      return NextResponse.json({
        success: true,
        evaluations: mockEvaluations,
      })
    }
  } catch (error) {
    console.error("Get evaluations error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get evaluations",
        evaluations: [],
        evaluation: null,
      },
      { status: 500 },
    )
  }
}
