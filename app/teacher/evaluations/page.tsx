"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, CheckCircle, Eye, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SECTION_NAMES, SECTION_MAX_SCORES } from "@/lib/types"

interface Evaluation {
  id: string
  userId: string
  studentName: string
  studentId: string
  classId: string
  semester: string
  academicYear: string
  section1: { selfScore: number; teacherScore?: number; evidence: string; files?: string[] }
  section2: { selfScore: number; teacherScore?: number; evidence: string; files?: string[] }
  section3: { selfScore: number; teacherScore?: number; evidence: string; files?: string[] }
  section4: { selfScore: number; teacherScore?: number; evidence: string; files?: string[] }
  section5: { selfScore: number; teacherScore?: number; evidence: string; files?: string[] }
  totalSelfScore: number
  finalScore?: number
  status: "submitted" | "graded"
  submittedAt: string
  teacherComments?: string
}

export default function EvaluationsPage() {
  const [evaluationsData, setEvaluationsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvaluation, setSelectedEvaluation] = useState<any | null>(null)
  const [isGradingDialogOpen, setIsGradingDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [grades, setGrades] = useState({
    section1: 0,
    section2: 0,
    section3: 0,
    section4: 0,
    section5: 0,
  })
  const [comments, setComments] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchEvaluations()
  }, [])

  const fetchEvaluations = async () => {
    try {
      const response = await fetch("/api/grading")
      const data = await response.json()
      if (data.success) {
        setEvaluationsData(data.evaluations)
      }
    } catch (error) {
      console.error("Error fetching evaluations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGradeEvaluation = async () => {
    if (!selectedEvaluation) return

    try {
      const response = await fetch("/api/grading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluationId: selectedEvaluation.id,
          grades,
          comments,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setEvaluationsData(
          evaluationsData.map((evalData) => (evalData.id === selectedEvaluation.id ? data.evaluation : evalData)),
        )
        setIsGradingDialogOpen(false)
        setSelectedEvaluation(null)
        setGrades({ section1: 0, section2: 0, section3: 0, section4: 0, section5: 0 })
        setComments("")
        toast({
          title: "Thành công",
          description: "Đã chấm điểm thành công",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể chấm điểm",
        variant: "destructive",
      })
    }
  }

  const openGradingDialog = (evaluation: any) => {
    setSelectedEvaluation(evaluation)
    setGrades({
      section1: evaluation.section1.teacherScore || evaluation.section1.selfScore,
      section2: evaluation.section2.teacherScore || evaluation.section2.selfScore,
      section3: evaluation.section3.teacherScore || evaluation.section3.selfScore,
      section4: evaluation.section4.teacherScore || evaluation.section4.selfScore,
      section5: evaluation.section5.teacherScore || evaluation.section5.selfScore,
    })
    setComments(evaluation.teacherComments || "")
    setIsGradingDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return <Badge className="bg-green-100 text-green-800">Đã chấm điểm</Badge>
      case "submitted":
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ chấm điểm</Badge>
      default:
        return <Badge variant="secondary">Chưa xác định</Badge>
    }
  }

  const filteredEvaluations = evaluationsData.filter((evaluation) => {
    if (filterStatus === "all") return true
    return evaluation.status === filterStatus
  })

  const stats = {
    total: evaluationsData.length,
    pending: evaluationsData.filter((e) => e.status === "submitted").length,
    graded: evaluationsData.filter((e) => e.status === "graded").length,
    averageScore:
      evaluationsData.filter((e) => e.finalScore).reduce((acc, e) => acc + (e.finalScore || 0), 0) /
        evaluationsData.filter((e) => e.finalScore).length || 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chấm điểm rèn luyện</h1>
        <p className="text-gray-600 mt-2">Xem xét và chấm điểm phiếu đánh giá của sinh viên</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng phiếu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ chấm</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã chấm</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.graded}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
            <Star className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.averageScore.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="submitted">Chờ chấm điểm</SelectItem>
              <SelectItem value="graded">Đã chấm điểm</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Evaluations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phiếu đánh giá ({filteredEvaluations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sinh viên</TableHead>
                <TableHead>Học kỳ</TableHead>
                <TableHead>Điểm tự chấm</TableHead>
                <TableHead>Điểm giảng viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày nộp</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{evaluation.studentName}</div>
                      <div className="text-sm text-muted-foreground">
                        {evaluation.studentId} • {evaluation.classId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {evaluation.semester} {evaluation.academicYear}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-blue-600">{evaluation.totalSelfScore}/100</div>
                  </TableCell>
                  <TableCell>
                    {evaluation.finalScore ? (
                      <div className="font-bold text-green-600">{evaluation.finalScore}/100</div>
                    ) : (
                      <span className="text-muted-foreground">Chưa chấm</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                  <TableCell>{new Date(evaluation.submittedAt).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => openGradingDialog(evaluation)}>
                      <Eye className="h-3 w-3 mr-1" />
                      {evaluation.status === "graded" ? "Xem" : "Chấm điểm"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Grading Dialog */}
      <Dialog open={isGradingDialogOpen} onOpenChange={setIsGradingDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chấm điểm phiếu đánh giá</DialogTitle>
            <DialogDescription>
              {selectedEvaluation && (
                <>
                  Sinh viên: {selectedEvaluation.studentName} ({selectedEvaluation.studentId}) •{" "}
                  {selectedEvaluation.semester} {selectedEvaluation.academicYear}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedEvaluation && (
            <Tabs defaultValue="grading" className="w-full">
              <TabsList>
                <TabsTrigger value="grading">Chấm điểm</TabsTrigger>
                <TabsTrigger value="evidence">Minh chứng</TabsTrigger>
              </TabsList>

              <TabsContent value="grading" className="space-y-4">
                {Object.entries(SECTION_NAMES).map(([sectionKey, sectionName]) => {
                  const sectionData = selectedEvaluation[sectionKey as keyof typeof selectedEvaluation] as any
                  const maxScore = SECTION_MAX_SCORES[sectionKey as keyof typeof SECTION_MAX_SCORES]

                  return (
                    <Card key={sectionKey}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {sectionName} (Tối đa: {maxScore} điểm)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Điểm tự chấm</Label>
                            <Input value={sectionData.selfScore} disabled />
                          </div>
                          <div>
                            <Label>Điểm giảng viên</Label>
                            <Input
                              type="number"
                              min="0"
                              max={maxScore}
                              value={grades[sectionKey as keyof typeof grades]}
                              onChange={(e) =>
                                setGrades({
                                  ...grades,
                                  [sectionKey]: Math.min(maxScore, Math.max(0, Number.parseInt(e.target.value) || 0)),
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Minh chứng sinh viên</Label>
                          <Textarea value={sectionData.evidence} disabled className="min-h-[60px]" />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                <Card>
                  <CardHeader>
                    <CardTitle>Nhận xét của giảng viên</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Nhập nhận xét về phiếu đánh giá..."
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Tổng điểm</div>
                    <div className="text-2xl font-bold">
                      {Object.values(grades).reduce((sum, score) => sum + score, 0)}/100
                    </div>
                  </div>
                  <Button onClick={handleGradeEvaluation} className="bg-[#005BAC] hover:bg-blue-700">
                    {selectedEvaluation.status === "graded" ? "Cập nhật điểm" : "Hoàn thành chấm điểm"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="evidence">
                <div className="space-y-4">
                  {Object.entries(SECTION_NAMES).map(([sectionKey, sectionName]) => {
                    const sectionData = selectedEvaluation[sectionKey as keyof typeof selectedEvaluation] as any

                    return (
                      <Card key={sectionKey}>
                        <CardHeader>
                          <CardTitle className="text-lg">{sectionName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <Label>Minh chứng</Label>
                              <p className="text-sm mt-1">{sectionData.evidence}</p>
                            </div>
                            {sectionData.files && sectionData.files.length > 0 && (
                              <div>
                                <Label>File đính kèm</Label>
                                <div className="flex gap-2 mt-1">
                                  {sectionData.files.map((file: string, index: number) => (
                                    <Button key={index} variant="outline" size="sm">
                                      Xem file {index + 1}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
