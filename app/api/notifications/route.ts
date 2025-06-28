import { type NextRequest, NextResponse } from "next/server"

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

const mockNotifications: Notification[] = [
  {
    id: "notif_1",
    title: "Phiếu đánh giá đã được chấm điểm",
    message: "Phiếu đánh giá HK1 2023-2024 của bạn đã được giảng viên chấm điểm. Điểm cuối cùng: 85/100",
    type: "success",
    recipientId: "7YYBQjndOBTs5LkWc0NyjFbzQai2",
    recipientRole: "student",
    createdAt: "2024-01-20T10:00:00.000Z",
    read: false,
  },
  {
    id: "notif_2",
    title: "Nhắc nhở nộp phiếu đánh giá",
    message: "Bạn có phiếu đánh giá HK2 2023-2024 chưa hoàn thành. Vui lòng hoàn thành trước ngày 30/01/2024",
    type: "warning",
    recipientId: "7YYBQjndOBTs5LkWc0NyjFbzQai2",
    recipientRole: "student",
    createdAt: "2024-01-18T09:00:00.000Z",
    read: true,
  },
  {
    id: "notif_3",
    title: "Có phiếu mới cần chấm điểm",
    message: "Sinh viên Nguyễn Thị Mai (SV002) đã nộp phiếu đánh giá HK1 2023-2024",
    type: "info",
    recipientId: "uOIFWpZIxlSnzsO9LiwBGrnTrU52",
    recipientRole: "teacher",
    createdAt: "2024-01-14T14:30:00.000Z",
    read: false,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const recipientId = searchParams.get("recipientId")
    const recipientRole = searchParams.get("recipientRole")
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    let filteredNotifications = [...mockNotifications]

    if (recipientId) {
      filteredNotifications = filteredNotifications.filter((notif) => notif.recipientId === recipientId)
    }

    if (recipientRole) {
      filteredNotifications = filteredNotifications.filter((notif) => notif.recipientRole === recipientRole)
    }

    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter((notif) => !notif.read)
    }

    // Sort by creation date (newest first)
    filteredNotifications.sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })

    const unreadCount = filteredNotifications.filter((notif) => !notif.read).length

    return NextResponse.json({
      success: true,
      notifications: filteredNotifications,
      unreadCount,
      total: filteredNotifications.length,
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get notifications",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, type, recipientId, recipientRole } = body

    if (!title || !message || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          required: ["title", "message", "type"],
        },
        { status: 400 },
      )
    }

    const validTypes = ["info", "success", "warning", "error"]
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid notification type",
          validTypes,
        },
        { status: 400 },
      )
    }

    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      recipientId: recipientId || null,
      recipientRole: recipientRole || null,
      createdAt: new Date().toISOString(),
      read: false,
    }

    mockNotifications.unshift(newNotification)

    return NextResponse.json({
      success: true,
      notification: newNotification,
      message: "Notification created successfully",
    })
  } catch (error) {
    console.error("Create notification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, read } = body

    if (!notificationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing notification ID",
        },
        { status: 400 },
      )
    }

    const notificationIndex = mockNotifications.findIndex((notif) => notif.id === notificationId)

    if (notificationIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Notification not found",
        },
        { status: 404 },
      )
    }

    mockNotifications[notificationIndex].read = read !== undefined ? Boolean(read) : true

    return NextResponse.json({
      success: true,
      notification: mockNotifications[notificationIndex],
      message: "Notification updated successfully",
    })
  } catch (error) {
    console.error("Update notification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
