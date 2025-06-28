"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Table, Calendar, Users, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ExportPage() {
  const [exportFormat, setExportFormat] = useState("csv")
  const [selectedSemester, setSelectedSemester] = useState("HK1 2023-2024")
  const [selectedClass, setSelectedClass] = useState("all")
  const [exportType, setExportType] = useState("detailed")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [selectedFields, setSelectedFields] = useState({
    studentInfo: true,
    scores: true,
    evidence: false,
    timestamps: true,
    comments: false,
  })

  const exportOptions = [
    {
      id: "students",
      title: "Danh sách sinh viên",
      description: "Xuất thông tin cơ bản của sinh viên",
      icon: Users,
      fields: ["Họ tên", "MSSV", "Lớp", "Email", "SĐT", "Ngày tạo"],
    },
    {
      id: "evaluations",
      title: "Kết quả đánh giá",
      description: "Xuất điểm số và kết quả rèn luyện",
      icon: FileText,
      fields: ["Thông tin SV", "Điểm từng mục", "Tổng điểm", "Trạng thái"],
    },
    {
      id: "detailed",
      title: "Báo cáo chi tiết",
      description: "Xuất đầy đủ thông tin bao gồm minh chứng",
      icon: Table,
      fields: ["Tất cả thông tin", "Minh chứng", "Nhận xét", "File đính kèm"],
    },
    {
      id: "summary",
      title: "Báo cáo tổng hợp",
      description: "Xuất thống kê và tổng hợp theo lớp",
      icon: Calendar,
      fields: ["Thống kê lớp", "Điểm trung bình", "Phân loại", "Tỷ lệ hoàn thành"],
    },
  ]

  const handleExport = async (type: string) => {
    setLoading(true)
    try {
      let url = ""
      let filename = ""

      switch (type) {
        case "students":
          url = `/api/students/export?format=${exportFormat}&semester=${selectedSemester}&classId=${selectedClass}`
          filename = `danh-sach-sinh-vien-${selectedSemester}-${Date.now()}`
          break
        case "evaluations":
        case "detailed":
          url = `/api/export/csv?format=${type}&semester=${selectedSemester}&classId=${selectedClass}`
          filename = `ket-qua-danh-gia-${selectedSemester}-${Date.now()}`
          break
        case "summary":
          url = `/api/export/csv?format=summary&semester=${selectedSemester}&classId=${selectedClass}`
          filename = `bao-cao-tong-hop-${selectedSemester}-${Date.now()}`
          break
        default:
          throw new Error("Invalid export type")
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `${filename}.${exportFormat}`
      a.click()
      window.URL.revokeObjectURL(downloadUrl)

      toast({
        title: "Thành công",
        description: `Đã xuất file ${exportFormat.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xuất dữ liệu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCustomExport = async () => {
    setLoading(true)
    try {
      // Mock custom export data
      const customData = [
        ["Họ tên", "MSSV", "Lớp", "Điểm cuối", "Xếp loại"],
        ["Nguyễn Văn A", "SV001", "CNTT2021A", "85", "Tốt"],
        ["Trần Thị B", "SV002", "CNTT2021A", "92", "Xuất sắc"],
      ]

      const response = await fetch("/api/export/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: customData,
          filename: "bao-cao-tuy-chinh",
          format: exportFormat,
        }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `bao-cao-tuy-chinh-${Date.now()}.${exportFormat}`
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Thành công",
        description: "Đã xuất báo cáo tùy chỉnh",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xuất báo cáo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Xuất dữ liệu</h1>
        <p className="text-gray-600 mt-2">Xuất báo cáo và dữ liệu hệ thống</p>
      </div>

      {/* Export Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Cài đặt xuất dữ liệu
          </CardTitle>
          <CardDescription>Chọn định dạng và phạm vi dữ liệu cần xuất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="format">Định dạng file</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Excel)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="semester">Học kỳ</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả học kỳ</SelectItem>
                  <SelectItem value="HK1 2023-2024">HK1 2023-2024</SelectItem>
                  <SelectItem value="HK2 2022-2023">HK2 2022-2023</SelectItem>
                  <SelectItem value="HK1 2022-2023">HK1 2022-2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="class">Lớp</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp</SelectItem>
                  <SelectItem value="CNTT2021A">CNTT2021A</SelectItem>
                  <SelectItem value="CNTT2021B">CNTT2021B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exportOptions.map((option) => {
          const Icon = option.icon
          return (
            <Card key={option.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-[#005BAC] rounded-lg">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  {option.title}
                </CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Trường dữ liệu:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {option.fields.map((field) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleExport(option.id)}
                    disabled={loading}
                    className="w-full bg-[#005BAC] hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Xuất {option.title}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Custom Export */}
      <Card>
        <CardHeader>
          <CardTitle>Xuất dữ liệu tùy chỉnh</CardTitle>
          <CardDescription>Chọn các trường dữ liệu cụ thể để xuất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="studentInfo"
                  checked={selectedFields.studentInfo}
                  onCheckedChange={(checked) =>
                    setSelectedFields({ ...selectedFields, studentInfo: checked as boolean })
                  }
                />
                <Label htmlFor="studentInfo">Thông tin sinh viên</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scores"
                  checked={selectedFields.scores}
                  onCheckedChange={(checked) => setSelectedFields({ ...selectedFields, scores: checked as boolean })}
                />
                <Label htmlFor="scores">Điểm số</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="evidence"
                  checked={selectedFields.evidence}
                  onCheckedChange={(checked) => setSelectedFields({ ...selectedFields, evidence: checked as boolean })}
                />
                <Label htmlFor="evidence">Minh chứng</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timestamps"
                  checked={selectedFields.timestamps}
                  onCheckedChange={(checked) =>
                    setSelectedFields({ ...selectedFields, timestamps: checked as boolean })
                  }
                />
                <Label htmlFor="timestamps">Thời gian</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="comments"
                  checked={selectedFields.comments}
                  onCheckedChange={(checked) => setSelectedFields({ ...selectedFields, comments: checked as boolean })}
                />
                <Label htmlFor="comments">Nhận xét</Label>
              </div>
            </div>
            <Button onClick={handleCustomExport} disabled={loading} className="bg-[#005BAC] hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Xuất dữ liệu tùy chỉnh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử xuất dữ liệu</CardTitle>
          <CardDescription>Các file đã xuất gần đây</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "danh-sach-sinh-vien-HK1-2023-2024.csv",
                type: "Danh sách sinh viên",
                date: "2024-01-20 14:30",
                size: "2.5 MB",
              },
              {
                name: "ket-qua-danh-gia-HK1-2023-2024.csv",
                type: "Kết quả đánh giá",
                date: "2024-01-19 10:15",
                size: "1.8 MB",
              },
              {
                name: "bao-cao-tong-hop-HK1-2023-2024.pdf",
                type: "Báo cáo tổng hợp",
                date: "2024-01-18 16:45",
                size: "3.2 MB",
              },
            ].map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-muted-foreground">{file.type}</div>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>{file.date}</div>
                  <div>{file.size}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
