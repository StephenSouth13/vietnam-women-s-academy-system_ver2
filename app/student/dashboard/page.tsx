"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, CheckCircle, Clock, AlertCircle, TrendingUp, Calendar, Award } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const { user } = useAuth()

  // Mock data - in real app, fetch from Firestore
  const stats = {
    totalEvaluations: 2,
    submitted: 1,
    draft: 1,
    graded: 1,
    averageScore: 85,
  }

  const recentEvaluations = [
    {
      id: "1",
      semester: "HK1",
      academicYear: "2023-2024",
      status: "graded",
      finalScore: 85,
      submittedAt: "2024-01-15",
    },
    {
      id: "2",
      semester: "HK2",
      academicYear: "2023-2024",
      status: "draft",
      submittedAt: null,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return <Badge className="bg-green-100 text-green-800">Đã chấm điểm</Badge>
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Đã nộp</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Bản nháp</Badge>
      default:
        return <Badge variant="secondary">Chưa xác định</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chào mừng, {user?.fullName}!</h1>
        <p className="text-gray-600 mt-2">Tổng quan về quá trình rèn luyện của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng phiếu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvaluations}</div>
            <p className="text-xs text-muted-foreground">Phiếu đánh giá đã tạo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã nộp</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.submitted}</div>
            <p className="text-xs text-muted-foreground">Phiếu đã nộp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bản nháp</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">Phiếu chưa hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.averageScore}</div>
            <p className="text-xs text-muted-foreground">Điểm trung bình</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>Các tác vụ thường dùng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-auto p-4 bg-[#005BAC] hover:bg-blue-700">
              <Link href="/student/evaluation">
                <div className="text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-medium">Tạo phiếu mới</div>
                  <div className="text-sm opacity-90">Bắt đầu đánh giá rèn luyện</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
              <Link href="/student/notifications">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-medium">Xem thông báo</div>
                  <div className="text-sm text-muted-foreground">Cập nhật mới nhất</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
              <Link href="/student/profile">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-medium">Cập nhật hồ sơ</div>
                  <div className="text-sm text-muted-foreground">Thông tin cá nhân</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Evaluations */}
      <Card>
        <CardHeader>
          <CardTitle>Phiếu đánh giá gần đây</CardTitle>
          <CardDescription>Danh sách các phiếu đánh giá của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {evaluation.semester} - {evaluation.academicYear}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {evaluation.submittedAt
                        ? `Nộp ngày: ${new Date(evaluation.submittedAt).toLocaleDateString("vi-VN")}`
                        : "Chưa nộp"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {evaluation.finalScore && (
                    <div className="text-right">
                      <div className="font-bold text-lg">{evaluation.finalScore}</div>
                      <div className="text-sm text-muted-foreground">điểm</div>
                    </div>
                  )}
                  {getStatusBadge(evaluation.status)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/student/evaluation">Xem tất cả phiếu đánh giá</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ rèn luyện</CardTitle>
          <CardDescription>Tổng quan về kết quả rèn luyện theo từng mục</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Học tập</span>
                <span>18/20</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Chấp hành nội quy</span>
                <span>23/25</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Hoạt động xã hội</span>
                <span>16/20</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Quan hệ công dân</span>
                <span>22/25</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Công tác lớp</span>
                <span>8/10</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
