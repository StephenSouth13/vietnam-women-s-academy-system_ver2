"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Upload, Save, Send, Download, Calendar } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { SECTION_NAMES, SECTION_MAX_SCORES } from "@/lib/types"

interface EvaluationData {
  semester: string
  academicYear: string
  section1: { selfScore: number; evidence: string; files: string[] }
  section2: { selfScore: number; evidence: string; files: string[] }
  section3: { selfScore: number; evidence: string; files: string[] }
  section4: { selfScore: number; evidence: string; files: string[] }
  section5: { selfScore: number; evidence: string; files: string[] }
  status: "draft" | "submitted"
}

export default function StudentEvaluationPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [currentTab, setCurrentTab] = useState("section1")

  const [evaluation, setEvaluation] = useState<EvaluationData>({
    semester: "HK1",
    academicYear: "2023-2024",
    section1: { selfScore: 0, evidence: "", files: [] },
    section2: { selfScore: 0, evidence: "", files: [] },
    section3: { selfScore: 0, evidence: "", files: [] },
    section4: { selfScore: 0, evidence: "", files: [] },
    section5: { selfScore: 0, evidence: "", files: [] },
    status: "draft",
  })

  const [existingEvaluations, setExistingEvaluations] = useState([
    {
      id: "1",
      semester: "HK1",
      academicYear: "2023-2024",
      totalScore: 87,
      finalScore: 85,
      status: "graded" as const,
      submittedAt: "2024-01-15",
    },
    {
      id: "2",
      semester: "HK2",
      academicYear: "2022-2023",
      totalScore: 92,
      finalScore: 88,
      status: "graded" as const,
      submittedAt: "2023-06-20",
    },
  ])

  useEffect(() => {
    // Load existing evaluation if exists
    if (user?.uid) {
      loadEvaluation()
    }
  }, [user?.uid, evaluation.semester, evaluation.academicYear])

  const loadEvaluation = async () => {
    try {
      if (!user?.uid) {
        console.log("No user ID available")
        return
      }

      const response = await fetch(
        `/api/scores?userId=${user.uid}&semester=${evaluation.semester}&academicYear=${evaluation.academicYear}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.evaluation) {
        setEvaluation((prev) => ({
          ...prev,
          ...data.evaluation,
          // Ensure we keep the current semester/year if they're different
          semester: prev.semester,
          academicYear: prev.academicYear,
        }))
      } else {
        console.log("No existing evaluation found, using default")
      }
    } catch (error) {
      console.error("Error loading evaluation:", error)
      toast({
        title: "Thông báo",
        description: "Không thể tải dữ liệu đánh giá. Sử dụng form trống.",
        variant: "default",
      })
    }
  }

  const handleSectionUpdate = (sectionKey: string, field: string, value: any) => {
    setEvaluation({
      ...evaluation,
      [sectionKey]: {
        ...evaluation[sectionKey as keyof EvaluationData],
        [field]: value,
      },
    })
  }

  const handleFileUpload = async (sectionKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        const section = evaluation[sectionKey as keyof EvaluationData] as any
        handleSectionUpdate(sectionKey, "files", [...section.files, data.url])
        toast({
          title: "Thành công",
          description: "Đã tải lên file minh chứng",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải lên file",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (submit = false) => {
    setLoading(true)
    try {
      const evaluationData = {
        ...evaluation,
        userId: user?.uid,
        status: submit ? "submitted" : "draft",
      }

      const response = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evaluationData),
      })

      const data = await response.json()
      if (data.success) {
        setEvaluation({ ...evaluation, status: submit ? "submitted" : "draft" })
        toast({
          title: "Thành công",
          description: submit ? "Đã nộp phiếu đánh giá" : "Đã lưu bản nháp",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu phiếu đánh giá",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluationId: `${user?.uid}_${evaluation.semester}_${evaluation.academicYear}`,
          studentData: user,
          evaluationData: evaluation,
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Mock PDF download
        toast({
          title: "Thành công",
          description: "Đã tạo file PDF",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xuất PDF",
        variant: "destructive",
      })
    }
  }

  const getTotalScore = () => {
    return (
      evaluation.section1.selfScore +
      evaluation.section2.selfScore +
      evaluation.section3.selfScore +
      evaluation.section4.selfScore +
      evaluation.section5.selfScore
    )
  }

  const getCompletionPercentage = () => {
    const sections = [
      evaluation.section1,
      evaluation.section2,
      evaluation.section3,
      evaluation.section4,
      evaluation.section5,
    ]
    const completedSections = sections.filter(
      (section) => section.selfScore > 0 && section.evidence.trim() !== "",
    ).length
    return (completedSections / sections.length) * 100
  }

  const canSubmit = () => {
    return getCompletionPercentage() === 100 && evaluation.status === "draft"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phiếu đánh giá rèn luyện</h1>
          <p className="text-gray-600 mt-2">
            {evaluation.semester} - {evaluation.academicYear}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất PDF
          </Button>
          <Button onClick={() => handleSave(false)} disabled={loading} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Lưu nháp
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={loading || !canSubmit()}
            className="bg-[#005BAC] hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Nộp phiếu
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tiến độ hoàn thành
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Hoàn thành: {getCompletionPercentage().toFixed(0)}%</span>
              <Badge variant={evaluation.status === "submitted" ? "default" : "secondary"}>
                {evaluation.status === "submitted" ? "Đã nộp" : "Bản nháp"}
              </Badge>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tổng điểm tự chấm: {getTotalScore()}/100</span>
              <span>5 mục đánh giá</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semester Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin học kỳ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="semester">Học kỳ</Label>
              <Select
                value={evaluation.semester}
                onValueChange={(value) => setEvaluation({ ...evaluation, semester: value })}
                disabled={evaluation.status === "submitted"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HK1">Học kỳ 1</SelectItem>
                  <SelectItem value="HK2">Học kỳ 2</SelectItem>
                  <SelectItem value="HK3">Học kỳ hè</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="academicYear">Năm học</Label>
              <Select
                value={evaluation.academicYear}
                onValueChange={(value) => setEvaluation({ ...evaluation, academicYear: value })}
                disabled={evaluation.status === "submitted"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                  <SelectItem value="2021-2022">2021-2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Các mục đánh giá</CardTitle>
          <CardDescription>Điền điểm và minh chứng cho từng mục đánh giá</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-5">
              {Object.entries(SECTION_NAMES).map(([key, name]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(SECTION_NAMES).map(([sectionKey, sectionName]) => {
              const sectionData = evaluation[sectionKey as keyof EvaluationData] as any
              const maxScore = SECTION_MAX_SCORES[sectionKey as keyof typeof SECTION_MAX_SCORES]

              return (
                <TabsContent key={sectionKey} value={sectionKey} className="space-y-4">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {sectionName} (Tối đa: {maxScore} điểm)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`score-${sectionKey}`}>Điểm tự chấm</Label>
                        <Input
                          id={`score-${sectionKey}`}
                          type="number"
                          min="0"
                          max={maxScore}
                          value={sectionData.selfScore}
                          onChange={(e) =>
                            handleSectionUpdate(
                              sectionKey,
                              "selfScore",
                              Math.min(maxScore, Math.max(0, Number.parseInt(e.target.value) || 0)),
                            )
                          }
                          disabled={evaluation.status === "submitted"}
                          className="w-32"
                        />
                        <p className="text-sm text-muted-foreground mt-1">Điểm từ 0 đến {maxScore}</p>
                      </div>

                      <div>
                        <Label htmlFor={`evidence-${sectionKey}`}>Minh chứng</Label>
                        <Textarea
                          id={`evidence-${sectionKey}`}
                          value={sectionData.evidence}
                          onChange={(e) => handleSectionUpdate(sectionKey, "evidence", e.target.value)}
                          disabled={evaluation.status === "submitted"}
                          placeholder="Mô tả chi tiết các hoạt động, thành tích liên quan đến mục này..."
                          className="min-h-[120px]"
                        />
                      </div>

                      <div>
                        <Label>File đính kèm</Label>
                        <div className="space-y-2">
                          {sectionData.files.map((file: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm">File {index + 1}</span>
                              <Button size="sm" variant="outline">
                                Xem
                              </Button>
                            </div>
                          ))}
                          {evaluation.status !== "submitted" && (
                            <div>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileUpload(sectionKey, e)}
                                disabled={uploading}
                                className="hidden"
                                id={`file-${sectionKey}`}
                              />
                              <label htmlFor={`file-${sectionKey}`}>
                                <Button variant="outline" disabled={uploading} asChild>
                                  <span>
                                    <Upload className="h-4 w-4 mr-2" />
                                    {uploading ? "Đang tải..." : "Thêm file"}
                                  </span>
                                </Button>
                              </label>
                              <p className="text-xs text-muted-foreground mt-1">Hỗ trợ: PDF, JPG, PNG (tối đa 5MB)</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        </CardContent>
      </Card>

      {/* Previous Evaluations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Phiếu đánh giá trước đây
          </CardTitle>
          <CardDescription>Lịch sử các phiếu đánh giá đã nộp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {existingEvaluations.map((evaluationItem) => (
              <div key={evaluationItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {evaluationItem.semester} {evaluationItem.academicYear}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Nộp ngày: {new Date(evaluationItem.submittedAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">
                      {evaluationItem.finalScore
                        ? `${evaluationItem.finalScore}/100`
                        : `${evaluationItem.totalScore}/100`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {evaluationItem.status === "graded" ? "Đã chấm điểm" : "Chờ chấm điểm"}
                    </div>
                  </div>
                  <Badge variant={evaluationItem.status === "graded" ? "default" : "secondary"}>
                    {evaluationItem.status === "graded" ? "Hoàn thành" : "Đang xử lý"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
