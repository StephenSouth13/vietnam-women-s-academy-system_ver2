"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Info, AlertTriangle, AlertCircle, Clock, User } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  createdAt: string
  read: boolean
}

export default function StudentNotificationsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications?recipientId=${user?.uid}&recipientRole=student`)
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

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId, read: true }),
      })

      const data = await response.json()
      if (data.success) {
        setNotifications(notifications.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái thông báo",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((notif) => !notif.read)
      await Promise.all(unreadNotifications.map((notif) => markAsRead(notif.id)))

      toast({
        title: "Thành công",
        description: "Đã đánh dấu tất cả thông báo là đã đọc",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông báo",
        variant: "destructive",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
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

  const unreadCount = notifications.filter((notif) => !notif.read).length
  const todayNotifications = notifications.filter(
    (notif) => new Date(notif.createdAt).toDateString() === new Date().toDateString(),
  )
  const olderNotifications = notifications.filter(
    (notif) => new Date(notif.createdAt).toDateString() !== new Date().toDateString(),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
          <p className="text-gray-600 mt-2">Cập nhật và thông báo từ hệ thống</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thông báo</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chưa đọc</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayNotifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã đọc</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Notifications */}
      {todayNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Thông báo hôm nay
            </CardTitle>
            <CardDescription>Các thông báo mới nhất trong ngày</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    !notification.read ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        {getNotificationBadge(notification.type)}
                        {!notification.read && <Badge variant="secondary">Mới</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(notification.createdAt).toLocaleTimeString("vi-VN")}</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Từ hệ thống
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Older Notifications */}
      {olderNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Thông báo trước đây
            </CardTitle>
            <CardDescription>Lịch sử thông báo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {olderNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    !notification.read ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
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
                          <User className="h-3 w-3" />
                          Từ hệ thống
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {notifications.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Chưa có thông báo</h3>
            <p className="text-muted-foreground">Bạn sẽ nhận được thông báo khi có cập nhật mới từ hệ thống.</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>Các tác vụ liên quan đến thông báo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 bg-transparent">
              <div className="text-center">
                <Bell className="h-8 w-8 mx-auto mb-2" />
                <div className="font-medium">Cài đặt thông báo</div>
                <div className="text-sm text-muted-foreground">Quản lý loại thông báo nhận</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 bg-transparent">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <div className="font-medium">Lịch sử đã đọc</div>
                <div className="text-sm text-muted-foreground">Xem thông báo đã đọc</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 bg-transparent">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <div className="font-medium">Thông báo quan trọng</div>
                <div className="text-sm text-muted-foreground">Chỉ hiện thông báo ưu tiên</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
