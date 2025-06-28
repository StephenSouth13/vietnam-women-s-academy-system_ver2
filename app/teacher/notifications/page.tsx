"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, Plus, Send, Users, User, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  recipientId?: string | null
  recipientRole?: "student" | "teacher" | null
  createdAt: string
  read: boolean
}

export default function TeacherNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info" as const,
    recipientRole: "all" as "all" | "student" | "teacher",
    recipientId: "",
  })

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications?recipientRole=teacher`)
      const data = await response.json()
      if (data.success) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNotification = async () => {
    try {
      const notificationData = {
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        ...(newNotification.recipientRole !== "all" && {
          recipientRole: newNotification.recipientRole,
          ...(newNotification.recipientId && { recipientId: newNotification.recipientId }),
        }),
      }

      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationData),
      })

      const data = await response.json()
      if (data.success) {
        setNotifications([data.notification, ...notifications])
        setNewNotification({
          title: "",
          message: "",
          type: "info",
          recipientRole: "all",
          recipientId: "",
        })
        setIsCreateDialogOpen(false)
        toast({
          title: "Thành công",
          description: "Đã gửi thông báo",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi thông báo",
        variant: "destructive",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Thành công</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Cảnh báo</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Lỗi</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800">Thông tin</Badge>
    }
  }

  const quickNotifications = [
    {
      title: "Nhắc nhở nộp phiếu đánh giá",
      message: "Các em sinh viên vui lòng hoàn thành phiếu đánh giá rèn luyện trước hạn chót.",
      type: "warning" as const,
    },
    {
      title: "Thông báo kết quả chấm điểm",
      message: "Kết quả chấm điểm rèn luyện đã được cập nhật. Các em có thể xem điểm trong hệ thống.",
      type: "success" as const,
    },
    {
      title: "Hướng dẫn sử dụng hệ thống",
      message: "Hướng dẫn chi tiết cách sử dụng hệ thống đánh giá rèn luyện đã được cập nhật.",
      type: "info" as const,
    },
  ]

  const stats = {
    total: notifications.length,
    sent: notifications.filter((n) => n.recipientRole === "student").length,
    received: notifications.filter((n) => n.recipientRole === "teacher").length,
    unread: notifications.filter((n) => !n.read).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý thông báo</h1>
          <p className="text-gray-600 mt-2">Gửi và quản lý thông báo cho sinh viên</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#005BAC] hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo thông báo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo thông báo mới</DialogTitle>
              <DialogDescription>Gửi thông báo đến sinh viên hoặc giảng viên</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  placeholder="Nhập tiêu đề thông báo"
                />
              </div>
              <div>
                <Label htmlFor="message">Nội dung</Label>
                <Textarea
                  id="message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  placeholder="Nhập nội dung thông báo"
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Loại thông báo</Label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value: any) => setNewNotification({ ...newNotification, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Thông tin</SelectItem>
                      <SelectItem value="success">Thành công</SelectItem>
                      <SelectItem value="warning">Cảnh báo</SelectItem>
                      <SelectItem value="error">Lỗi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="recipient">Người nhận</Label>
                  <Select
                    value={newNotification.recipientRole}
                    onValueChange={(value: any) => setNewNotification({ ...newNotification, recipientRole: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="student">Sinh viên</SelectItem>
                      <SelectItem value="teacher">Giảng viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreateNotification} className="w-full bg-[#005BAC] hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Gửi thông báo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thông báo</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã gửi</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã nhận</CardTitle>
            <Bell className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.received}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chưa đọc</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.unread}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Thông báo nhanh</CardTitle>
          <CardDescription>Các mẫu thông báo thường dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickNotifications.map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(template.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{template.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{template.message}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 bg-transparent"
                        onClick={() => {
                          setNewNotification({
                            title: template.title,
                            message: template.message,
                            type: template.type,
                            recipientRole: "student",
                            recipientId: "",
                          })
                          setIsCreateDialogOpen(true)
                        }}
                      >
                        Sử dụng mẫu
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử thông báo</CardTitle>
          <CardDescription>Danh sách các thông báo đã gửi và nhận</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${!notification.read ? "bg-blue-50 border-blue-200" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        {getNotificationBadge(notification.type)}
                        {!notification.read && <Badge variant="secondary">Mới</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(notification.createdAt).toLocaleString("vi-VN")}</span>
                        <span className="flex items-center gap-1">
                          {notification.recipientRole === "student" ? (
                            <>
                              <User className="h-3 w-3" />
                              Gửi đến sinh viên
                            </>
                          ) : notification.recipientRole === "teacher" ? (
                            <>
                              <Users className="h-3 w-3" />
                              Gửi đến giảng viên
                            </>
                          ) : (
                            <>
                              <Users className="h-3 w-3" />
                              Gửi đến tất cả
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có thông báo nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
