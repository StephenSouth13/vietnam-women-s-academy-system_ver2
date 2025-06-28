"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Edit, Camera, Save, Shield, Award, BookOpen, Loader2, Users, Calendar, FileText } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function TeacherProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "")

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
    position: user?.position || "",
    dateOfBirth: user?.dateOfBirth || "",
    address: "Hà Nội, Việt Nam",
    bio: "Giảng viên khoa Công nghệ thông tin với 10 năm kinh nghiệm giảng dạy và nghiên cứu.",
    joinDate: "2020-09-01",
    education: "Tiến sĩ Công nghệ thông tin",
    specialization: "Trí tuệ nhân tạo, Machine Learning",
    officeHours: "Thứ 2, 4, 6: 14:00-16:00",
    researchInterests: "AI, Machine Learning, Data Science, Computer Vision",
  })

  const handleSaveProfile = async () => {
    try {
      // Mock API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin cá nhân",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin",
        variant: "destructive",
      })
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Lỗi",
        description: "Chỉ hỗ trợ file JPG và PNG",
        variant: "destructive",
      })
      return
    }

    // Validate file size (2MB max for avatars)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "File quá lớn. Kích thước tối đa 2MB",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Update avatar URL in state
        setAvatarUrl(data.url)

        toast({
          title: "Thành công",
          description: data.message || "Đã cập nhật ảnh đại diện",
        })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error) {
      console.error("Avatar upload error:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải lên ảnh. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // Clear the input
      event.target.value = ""
    }
  }

  // Mock teaching data
  const teachingData = {
    yearsOfExperience: 10,
    studentsManaged: 45,
    coursesTeaching: ["Lập trình Web", "Cơ sở dữ liệu", "Trí tuệ nhân tạo"],
    evaluationsGraded: 128,
    averageGradingTime: "2.5 ngày",
    completionRate: "95%",
    publications: [
      { title: "Machine Learning in Education", year: "2023", journal: "IEEE Transactions on Education" },
      { title: "AI-based Student Assessment", year: "2022", journal: "Computers & Education" },
      { title: "Data Mining for Academic Performance", year: "2021", journal: "Educational Data Mining" },
    ],
    awards: [
      { title: "Giảng viên xuất sắc", year: "2023", organization: "Học viện Phụ nữ Việt Nam" },
      { title: "Giải thưởng nghiên cứu khoa học", year: "2022", organization: "Bộ Giáo dục và Đào tạo" },
      { title: "Giảng viên được yêu thích nhất", year: "2021", organization: "Sinh viên bình chọn" },
    ],
  }

  const workloadData = {
    currentSemester: "HK1 2023-2024",
    totalClasses: 6,
    totalStudents: 180,
    pendingEvaluations: 8,
    completedEvaluations: 120,
  }

  const workloadPercentage =
    (workloadData.completedEvaluations / (workloadData.completedEvaluations + workloadData.pendingEvaluations)) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ giảng viên</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân và hoạt động giảng dạy</p>
        </div>
        <Button
          onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
          className="bg-[#005BAC] hover:bg-blue-700"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Lưu thay đổi
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="teaching">Giảng dạy</TabsTrigger>
          <TabsTrigger value="research">Nghiên cứu</TabsTrigger>
          <TabsTrigger value="achievements">Thành tích</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">{user?.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className={`absolute bottom-0 right-0 p-1 bg-[#005BAC] rounded-full cursor-pointer hover:bg-blue-700 transition-colors ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 text-white" />
                    )}
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{user?.fullName}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-[#005BAC]">Giảng viên</Badge>
                    <Badge variant="outline">{profileData.department}</Badge>
                    <Badge variant="outline">{profileData.position}</Badge>
                  </div>
                  {uploading && <p className="text-sm text-muted-foreground mt-2">Đang tải lên ảnh đại diện...</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>Thông tin cá nhân và liên hệ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profileData.email} disabled />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin công việc</CardTitle>
                <CardDescription>Thông tin về vị trí và bộ phận làm việc</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="department">Khoa/Bộ môn</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Chức vụ</Label>
                  <Input
                    id="position"
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="education">Trình độ học vấn</Label>
                  <Input
                    id="education"
                    value={profileData.education}
                    onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="joinDate">Ngày bắt đầu làm việc</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={profileData.joinDate}
                    onChange={(e) => setProfileData({ ...profileData, joinDate: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="officeHours">Giờ làm việc</Label>
                  <Input
                    id="officeHours"
                    value={profileData.officeHours}
                    onChange={(e) => setProfileData({ ...profileData, officeHours: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bio and Specialization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Giới thiệu</CardTitle>
                <CardDescription>Thông tin về bản thân và kinh nghiệm</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="bio">Giới thiệu bản thân</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chuyên môn</CardTitle>
                <CardDescription>Lĩnh vực chuyên môn và nghiên cứu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="specialization">Chuyên ngành</Label>
                  <Input
                    id="specialization"
                    value={profileData.specialization}
                    onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="researchInterests">Lĩnh vực nghiên cứu</Label>
                  <Textarea
                    id="researchInterests"
                    value={profileData.researchInterests}
                    onChange={(e) => setProfileData({ ...profileData, researchInterests: e.target.value })}
                    disabled={!isEditing}
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teaching" className="space-y-6">
          {/* Teaching Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kinh nghiệm</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{teachingData.yearsOfExperience}</div>
                <p className="text-xs text-muted-foreground">năm giảng dạy</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SV quản lý</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{teachingData.studentsManaged}</div>
                <p className="text-xs text-muted-foreground">sinh viên hiện tại</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Phiếu đã chấm</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{teachingData.evaluationsGraded}</div>
                <p className="text-xs text-muted-foreground">tổng phiếu đã chấm</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{teachingData.completionRate}</div>
                <p className="text-xs text-muted-foreground">công việc hoàn thành</p>
              </CardContent>
            </Card>
          </div>

          {/* Current Workload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Khối lượng công việc hiện tại
              </CardTitle>
              <CardDescription>Tình hình công việc trong {workloadData.currentSemester}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{workloadData.totalClasses}</div>
                    <p className="text-sm text-muted-foreground">lớp học phụ trách</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{workloadData.totalStudents}</div>
                    <p className="text-sm text-muted-foreground">tổng sinh viên</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{workloadData.pendingEvaluations}</div>
                    <p className="text-sm text-muted-foreground">phiếu chờ chấm</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{workloadPercentage.toFixed(0)}%</div>
                    <p className="text-sm text-muted-foreground">tiến độ hoàn thành</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tiến độ chấm điểm</span>
                    <span>
                      {workloadData.completedEvaluations}/
                      {workloadData.completedEvaluations + workloadData.pendingEvaluations} phiếu
                    </span>
                  </div>
                  <Progress value={workloadPercentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses Teaching */}
          <Card>
            <CardHeader>
              <CardTitle>Môn học đang giảng dạy</CardTitle>
              <CardDescription>Danh sách các môn học trong học kỳ hiện tại</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {teachingData.coursesTeaching.map((course, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{course}</div>
                        <div className="text-sm text-muted-foreground">Học kỳ 1 - 2023/2024</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          {/* Publications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Công trình nghiên cứu
              </CardTitle>
              <CardDescription>Danh sách các bài báo và công trình đã công bố</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachingData.publications.map((publication, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{publication.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">{publication.journal}</div>
                        <div className="text-xs text-muted-foreground mt-1">Năm xuất bản: {publication.year}</div>
                      </div>
                      <Badge variant="outline">{publication.year}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Research Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Lĩnh vực nghiên cứu</CardTitle>
              <CardDescription>Các chủ đề nghiên cứu quan tâm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Chuyên môn chính</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Trí tuệ nhân tạo", "Machine Learning", "Deep Learning", "Computer Vision"].map((field) => (
                      <Badge key={field} variant="outline">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Lĩnh vực ứng dụng</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Giáo dục", "Y tế", "Tài chính", "Nông nghiệp"].map((application) => (
                      <Badge key={application} variant="outline">
                        {application}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Công nghệ</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Python", "TensorFlow", "PyTorch", "R", "MATLAB"].map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Awards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Giải thưởng và danh hiệu
              </CardTitle>
              <CardDescription>Các giải thưởng và danh hiệu đã đạt được</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachingData.awards.map((award, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{award.title}</div>
                      <div className="text-sm text-muted-foreground">{award.organization}</div>
                      <div className="text-xs text-muted-foreground">Năm {award.year}</div>
                    </div>
                    <Badge variant="default">{award.year}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Professional Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động chuyên môn</CardTitle>
              <CardDescription>Các hoạt động và vai trò trong cộng đồng học thuật</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Thành viên hội đồng khoa học</div>
                      <div className="text-sm text-muted-foreground">Khoa Công nghệ thông tin</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Reviewer cho tạp chí khoa học</div>
                      <div className="text-sm text-muted-foreground">IEEE Transactions on Education</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Tổ chức hội thảo khoa học</div>
                      <div className="text-sm text-muted-foreground">AI in Education Conference 2023</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật tài khoản</CardTitle>
              <CardDescription>Quản lý mật khẩu và cài đặt bảo mật</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <Input id="currentPassword" type="password" placeholder="Nhập mật khẩu hiện tại" />
              </div>
              <div>
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input id="newPassword" type="password" placeholder="Nhập mật khẩu mới" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <Input id="confirmPassword" type="password" placeholder="Nhập lại mật khẩu mới" />
              </div>
              <Button className="bg-[#005BAC] hover:bg-blue-700">
                <Shield className="h-4 w-4 mr-2" />
                Cập nhật mật khẩu
              </Button>
            </CardContent>
          </Card>

          {/* Login History */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử đăng nhập</CardTitle>
              <CardDescription>Các lần đăng nhập gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "Hôm nay, 14:30", device: "Chrome trên Windows", location: "Hà Nội, VN", current: true },
                  { time: "Hôm qua, 09:15", device: "Safari trên iPhone", location: "Hà Nội, VN", current: false },
                  {
                    time: "2 ngày trước, 16:45",
                    device: "Chrome trên Windows",
                    location: "Hà Nội, VN",
                    current: false,
                  },
                ].map((login, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{login.device}</div>
                        <div className="text-sm text-muted-foreground">{login.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{login.time}</div>
                      {login.current && <Badge className="bg-green-100 text-green-800">Hiện tại</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
