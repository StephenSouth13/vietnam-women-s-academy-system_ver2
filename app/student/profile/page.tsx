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
import { Edit, Camera, Save, Shield, Award, BookOpen, Loader2 } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function StudentProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "")

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    studentId: user?.studentId || "",
    classId: user?.classId || "",
    dateOfBirth: user?.dateOfBirth || "",
    address: "Hà Nội, Việt Nam",
    bio: "Sinh viên năm 3 khoa Công nghệ thông tin, yêu thích lập trình và tham gia các hoạt động xã hội.",
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

  // Mock academic data
  const academicData = {
    currentSemester: "HK1 2023-2024",
    gpa: 3.45,
    totalCredits: 85,
    completedCredits: 72,
    evaluationScores: [
      { semester: "HK1 2023-2024", score: 85, status: "Đã chấm" },
      { semester: "HK2 2022-2023", score: 88, status: "Đã chấm" },
      { semester: "HK1 2022-2023", score: 82, status: "Đã chấm" },
    ],
    achievements: [
      { title: "Sinh viên xuất sắc", year: "2023", type: "academic" },
      { title: "Giải nhì cuộc thi lập trình", year: "2023", type: "competition" },
      { title: "Tình nguyện viên tiêu biểu", year: "2022", type: "volunteer" },
    ],
  }

  const progressPercentage = (academicData.completedCredits / academicData.totalCredits) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin và theo dõi tiến độ học tập</p>
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
          <TabsTrigger value="academic">Học tập</TabsTrigger>
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
                    <Badge className="bg-[#005BAC]">Sinh viên</Badge>
                    <Badge variant="outline">{profileData.studentId}</Badge>
                    <Badge variant="outline">{profileData.classId}</Badge>
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
                <CardTitle>Thông tin học tập</CardTitle>
                <CardDescription>Thông tin về lớp học và chương trình đào tạo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="studentId">Mã số sinh viên</Label>
                  <Input id="studentId" value={profileData.studentId} disabled />
                </div>
                <div>
                  <Label htmlFor="classId">Lớp</Label>
                  <Input
                    id="classId"
                    value={profileData.classId}
                    onChange={(e) => setProfileData({ ...profileData, classId: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="currentSemester">Học kỳ hiện tại</Label>
                  <Input id="currentSemester" value={academicData.currentSemester} disabled />
                </div>
                <div>
                  <Label htmlFor="gpa">GPA</Label>
                  <Input id="gpa" value={academicData.gpa.toFixed(2)} disabled />
                </div>
                <div>
                  <Label htmlFor="bio">Giới thiệu bản thân</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          {/* Academic Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Tiến độ học tập
              </CardTitle>
              <CardDescription>Tổng quan về quá trình học tập</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{academicData.gpa}</div>
                    <p className="text-sm text-muted-foreground">GPA tích lũy</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{academicData.completedCredits}</div>
                    <p className="text-sm text-muted-foreground">Tín chỉ đã hoàn thành</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{progressPercentage.toFixed(0)}%</div>
                    <p className="text-sm text-muted-foreground">Tiến độ chương trình</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tiến độ hoàn thành chương trình</span>
                    <span>
                      {academicData.completedCredits}/{academicData.totalCredits} tín chỉ
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation History */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử đánh giá rèn luyện</CardTitle>
              <CardDescription>Kết quả đánh giá rèn luyện qua các học kỳ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {academicData.evaluationScores.map((evaluation, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Award className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{evaluation.semester}</div>
                        <div className="text-sm text-muted-foreground">{evaluation.status}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{evaluation.score}</div>
                      <div className="text-sm text-muted-foreground">điểm</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Thành tích và giải thưởng
              </CardTitle>
              <CardDescription>Các thành tích đã đạt được trong quá trình học tập</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {academicData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">Năm {achievement.year}</div>
                    </div>
                    <Badge
                      variant={
                        achievement.type === "academic"
                          ? "default"
                          : achievement.type === "competition"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {achievement.type === "academic"
                        ? "Học tập"
                        : achievement.type === "competition"
                          ? "Thi đấu"
                          : "Tình nguyện"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills & Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Kỹ năng và sở thích</CardTitle>
              <CardDescription>Các kỹ năng và lĩnh vực quan tâm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Kỹ năng lập trình</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["JavaScript", "Python", "Java", "React", "Node.js"].map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Sở thích</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Đọc sách", "Thể thao", "Du lịch", "Âm nhạc", "Nhiếp ảnh"].map((hobby) => (
                      <Badge key={hobby} variant="outline">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Hoạt động tham gia</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["CLB Lập trình", "Đoàn thanh niên", "Tình nguyện", "Thể thao"].map((activity) => (
                      <Badge key={activity} variant="outline">
                        {activity}
                      </Badge>
                    ))}
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
