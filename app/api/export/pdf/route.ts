import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { evaluationId, studentData, evaluationData } = await request.json()

    if (!evaluationId) {
      return NextResponse.json({ error: "Missing evaluation ID" }, { status: 400 })
    }

    // Mock PDF generation - in real app, use jsPDF or similar
    const pdfData = {
      filename: `phieu-danh-gia-${evaluationId}-${Date.now()}.pdf`,
      content: "Mock PDF content",
      studentInfo: studentData,
      evaluation: evaluationData,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      pdf: pdfData,
      downloadUrl: `/api/export/pdf/download?id=${evaluationId}`,
    })
  } catch (error) {
    console.error("Generate PDF error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing evaluation ID" }, { status: 400 })
    }

    // Mock PDF content
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Phieu Danh Gia Ren Luyen) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`

    return new NextResponse(pdfContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="phieu-danh-gia-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Download PDF error:", error)
    return NextResponse.json({ error: "Failed to download PDF" }, { status: 500 })
  }
}
