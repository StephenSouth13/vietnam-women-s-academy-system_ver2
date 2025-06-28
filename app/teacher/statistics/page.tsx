"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Award, Calendar, Target } from "lucide-react"

export default function StatisticsPage() {
  const [selectedSemester, setSelectedSemester] = useState("HK1 2023-2024")
  const [selectedClass, setSelectedClass] = useState("all")

  // Mock statistics data
  const stats = {
    overview: {
      totalStudents: 45,
      submittedEvaluations: 42,
      gradedEvaluations: 38,
      averageScore: 82.5,
      completionRate: 93.3,
    },
    scoreDistribution: [
      { range: "90-100", label: "Xuất sắc", count: 8, percentage: 21.1, color: "bg-green-500" },
      { range: "80-89", label: "Tốt", count: 18, percentage: 47.4, color: "bg-blue-500" },
      { range: "70-79", label: "Khá", count: 10, percentage: 26.3, color: "bg-yellow-500" },
      { range: "60-69", label: "Trung bình", count: 2, percentage: 5.3, color: "bg-orange-500" },
      { range: "0-59", label: "Yếu", count: 0, percentage: 0, color: "bg-red-500" },
    ],
    sectionAverages: [
      { section: "Học tập", average: 17.2, maxScore: 20, percentage: 86 },
      { section: "Chấp hành nội quy", average: 22.1, maxScore: 25, percentage: 88.4 },
      { section: "Hoạt động xã hội", average: 16.8, maxScore: 20, percentage: 84 },
      { section: "Quan hệ công dân", average: 21.5, maxScore: 25, percentage: 86 },
      { section: "Công tác lớp", average: 7.9, maxScore: 10, percentage: 79 },
    ],
    classComparison: [
      { class: "CNTT2021A", students: 25, average: 84.2, completion: 96 },
      { class: "CNTT2021B", students: 20, average: 80.1, completion: 90 },
    ],
    trends: [
      { period: "HK1 2022-2023", average: 78.5 },
      { period: "HK2 2022-2023", average: 80.2 },
      { period: "HK1 2023-2024", average: 82.5 },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thống kê và báo cáo</h1>
          <p className="text-gray-600 mt-2">Phân tích kết quả rèn luyện sinh viên</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn học kỳ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HK1 2023-2024">HK1 2023-2024</SelectItem>
              <SelectItem value="HK2 2022-2023">HK2 2022-2023</SelectItem>
              <SelectItem value="HK1 2022-2023">HK1 2022-2023</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn lớp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả lớp</SelectItem>
              <SelectItem value="CNTT2021A">CNTT2021A</SelectItem>
              <SelectItem value="CNTT2021B">CNTT2021B</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng SV</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Sinh viên trong hệ thống</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã nộp</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.overview.submittedEvaluations}</div>
            <p className="text-xs text-muted-foreground">Phiếu đã nộp</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã chấm</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.overview.gradedEvaluations}</div>
            <p className="text-xs text-muted-foreground">Phiếu đã chấm điểm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.overview.averageScore}</div>
            <p className="text-xs text-muted-foreground">Điểm trung bình</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.overview.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Sinh viên đã nộp</p>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Phân bố điểm số
          </CardTitle>
          <CardDescription>Thống kê điểm rèn luyện theo từng mức</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.scoreDistribution.map((item) => (
              <div key={item.range} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Badge variant="outline" className="min-w-fit">
                    {item.range}
                  </Badge>
                  <span className="font-medium">{item.label}</span>
                  <div className="flex-1 mx-4">
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium">{item.count} SV</span>
                  <span className="text-muted-foreground">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Averages */}
      <Card>
        <CardHeader>
          <CardTitle>Điểm trung bình theo từng mục</CardTitle>
          <CardDescription>Phân tích chi tiết điểm số các mục đánh giá</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.sectionAverages.map((section) => (
              <div key={section.section} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{section.section}</span>
                  <span className="text-sm text-muted-foreground">
                    {section.average}/{section.maxScore} ({section.percentage}%)
                  </span>
                </div>
                <Progress value={section.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Class Comparison & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>So sánh theo lớp</CardTitle>
            <CardDescription>Kết quả rèn luyện của các lớp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.classComparison.map((classData) => (
                <div key={classData.class} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{classData.class}</span>
                    <Badge>{classData.students} SV</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Điểm trung bình</span>
                      <span className="font-medium">{classData.average}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tỷ lệ hoàn thành</span>
                      <span className="font-medium">{classData.completion}%</span>
                    </div>
                    <Progress value={classData.completion} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xu hướng theo thời gian</CardTitle>
            <CardDescription>Biến động điểm số qua các học kỳ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.trends.map((trend, index) => (
                <div key={trend.period} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{trend.period}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{trend.average}</span>
                    {index > 0 && (
                      <Badge variant={trend.average > stats.trends[index - 1].average ? "default" : "secondary"}>
                        {trend.average > stats.trends[index - 1].average ? "↗" : "↘"}
                        {Math.abs(trend.average - stats.trends[index - 1].average).toFixed(1)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Nhận xét và đề xuất</CardTitle>
          <CardDescription>Phân tích tự động dựa trên dữ liệu thống kê</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Điểm mạnh</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Tỷ lệ hoàn thành phiếu đánh giá cao (93.3%)</li>
                <li>• Điểm trung bình tăng so với học kỳ trước (+2.3 điểm)</li>
                <li>• Mục "Chấp hành nội quy" có điểm cao nhất (88.4%)</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Cần cải thiện</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Mục "Công tác lớp" có điểm thấp nhất (79%)</li>
                <li>• Lớp CNTT2021B cần hỗ trợ thêm (điểm TB: 80.1)</li>
                <li>• Còn 7 sinh viên chưa nộp phiếu đánh giá</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Đề xuất</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Tổ chức thêm hoạt động để nâng cao điểm "Công tác lớp"</li>
                <li>• Nhắc nhở sinh viên chưa nộp phiếu hoàn thành đánh giá</li>
                <li>• Chia sẻ kinh nghiệm từ lớp CNTT2021A cho lớp CNTT2021B</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
