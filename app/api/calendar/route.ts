import { type NextRequest, NextResponse } from "next/server"
import type { CalendarEvent } from "@/lib/calendar-types"

// Mock data for calendar events
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Họp khoa",
    description: "Họp định kỳ khoa Công nghệ thông tin",
    startDate: "2024-01-15",
    endDate: "2024-01-15",
    startTime: "09:00",
    endTime: "11:00",
    type: "meeting",
    location: "Phòng họp A101",
    attendees: ["teacher1", "teacher2"],
    createdBy: "teacher1",
    createdAt: "2024-01-10T10:00:00Z",
    isAllDay: false,
    reminder: 30,
  },
  {
    id: "2",
    title: "Hạn nộp báo cáo",
    description: "Hạn cuối nộp báo cáo đánh giá rèn luyện",
    startDate: "2024-01-20",
    endDate: "2024-01-20",
    startTime: "23:59",
    endTime: "23:59",
    type: "deadline",
    createdBy: "teacher1",
    createdAt: "2024-01-10T10:00:00Z",
    isAllDay: false,
    reminder: 1440, // 1 day
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Filter events by date range if provided
    let filteredEvents = mockEvents
    if (startDate && endDate) {
      filteredEvents = mockEvents.filter((event) => {
        const eventDate = new Date(event.startDate)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return eventDate >= start && eventDate <= end
      })
    }

    return NextResponse.json({
      success: true,
      events: filteredEvents,
    })
  } catch (error) {
    console.error("Calendar API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json()

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      ...eventData,
      createdAt: new Date().toISOString(),
    }

    // In real app, save to database
    mockEvents.push(newEvent)

    return NextResponse.json({
      success: true,
      event: newEvent,
      message: "Đã tạo sự kiện thành công",
    })
  } catch (error) {
    console.error("Create event error:", error)
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()

    const eventIndex = mockEvents.findIndex((event) => event.id === id)
    if (eventIndex === -1) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
    }

    mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...updateData }

    return NextResponse.json({
      success: true,
      event: mockEvents[eventIndex],
      message: "Đã cập nhật sự kiện",
    })
  } catch (error) {
    console.error("Update event error:", error)
    return NextResponse.json({ success: false, error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Event ID required" }, { status: 400 })
    }

    const eventIndex = mockEvents.findIndex((event) => event.id === id)
    if (eventIndex === -1) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
    }

    mockEvents.splice(eventIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Đã xóa sự kiện",
    })
  } catch (error) {
    console.error("Delete event error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 })
  }
}
