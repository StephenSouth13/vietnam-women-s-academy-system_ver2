"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, CheckCircle, Clock, AlertTriangle, TrendingUp, BarChart3, Download } from "lucide-react"
import Link from "next/link"

export default function TeacherDashboard() {
  const { user } = useAuth()

  // Mock data - in real app, fetch from Firestore
  const stats = {
    totalStudents: 45,
    submittedEvaluations: 32,
    pendingGrading: 8,
    completedGrading: 24,
    averageScore: 82.5,
  }

  const recentSubmissions = [
    {
      id: "1",
      studentName: "Nguyễn Thị Mai",
      studentId: "SV001",
      semester: "HK1 2023-2024",
      submittedAt: "2024-01-15",
      status: "pending",
    },
    {
      id: "2",
      studentName: "Trần Văn Nam",
      studentId: "SV002",
      semester: "HK1 2023-2024",
      submittedAt: "2024-01-14",
      status: "graded",
    },
    {
      id: "3",
      studentName: "Lê Thị Hoa",
      studentId: "SV003",
      semester: "HK1 2023-2024",
      submittedAt: "2024-01-13",
      status: "pending",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return <Badge className="bg-green-100 text-green-800">Đã chấm</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ chấm</Badge>
      default:
        return <Badge variant="secondary">Chưa xác định</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Giảng viên</h1>
        <p className="text-gray-600 mt-2">Chào mừng {user?.fullName}, quản lý và chấm điểm rèn luyện sinh viên</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng SV</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Sinh viên được quản lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã nộp</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.submittedEvaluations}</div>
            <p className="text-xs text-muted-foreground">Phiếu đã nộp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ chấm</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingGrading}</div>
            <p className="text-xs text-muted-foreground">Phiếu cần chấm điểm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã chấm</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedGrading}</div>
            <p className="text-xs text-muted-foreground">Phiếu đã hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.averageScore}</div>
            <p className="text-xs text-muted-foreground">Điểm trung bình lớp</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>Các tác vụ thường dùng trong quản lý</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button asChild className="h-auto p-4 bg-[#005BAC] hover:bg-blue-700">
              <Link href="/teacher/evaluations">
                <div className="text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-medium">Chấm điểm</div>
                  <div className="text-sm opacity-90">Xem phiếu cần chấm</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
              <Link href="/teacher/students">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-medium">Quản lý SV</div>
                  <div className="text-sm text-muted-foreground">Danh sách sinh viên</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
              <Link href="/teacher/statistics">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-medium">Thống kê</div>
                  <div className="text-sm text-muted-foreground">Báo cáo chi tiết</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
              <Link href="/teacher/export">
                <div className="text-center">
                  <Download className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-medium">Xuất dữ liệu</div>
                  <div className="text-sm text-muted-foreground">Export CSV/PDF</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Phiếu cần chấm điểm
          </CardTitle>
          <CardDescription>Danh sách phiếu đánh giá mới nhất cần được xem xét</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{submission.studentName}</div>
                    <div className="text-sm text-muted-foreground">
                      {submission.studentId} • {submission.semester}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Nộp: {new Date(submission.submittedAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(submission.status)}
                  {submission.status === "pending" && (
                    <Button size="sm" asChild>
                      <Link href={`/teacher/evaluations/${submission.id}`}>Chấm điểm</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/teacher/evaluations">Xem tất cả phiếu đánh giá</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phân bố điểm số</CardTitle>
            <CardDescription>Thống kê điểm rèn luyện theo khoảng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Xuất sắc (90-100)</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                  <span className="text-sm font-medium">8 SV</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tốt (80-89)</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <span className="text-sm font-medium">18 SV</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Khá (70-79)</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                  <span className="text-sm font-medium">6 SV</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Trung bình (60-69)</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                  </div>
                  <span className="text-sm font-medium">0 SV</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tiến độ chấm điểm</CardTitle>
            <CardDescription>Tình hình hoàn thành công việc chấm điểm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">75%</div>
                <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Đã chấm điểm</span>
                  <span className="font-medium">24/32</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Còn lại: 8 phiếu</span>
                  <span>Mục tiêu: 100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
