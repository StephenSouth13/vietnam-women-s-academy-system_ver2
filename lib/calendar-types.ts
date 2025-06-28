export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  type: "personal" | "shared" | "meeting" | "deadline" | "reminder"
  location?: string
  attendees?: string[]
  createdBy: string
  createdAt: string
  isAllDay: boolean
  reminder?: number // minutes before event
  color?: string
}

export interface CalendarView {
  type: "month" | "week" | "day"
  date: Date
}

export const eventTypeColors = {
  personal: "#3B82F6", // blue
  shared: "#10B981", // green
  meeting: "#F59E0B", // amber
  deadline: "#EF4444", // red
  reminder: "#8B5CF6", // purple
}

export const eventTypeLabels = {
  personal: "Cá nhân",
  shared: "Chia sẻ",
  meeting: "Cuộc họp",
  deadline: "Hạn chót",
  reminder: "Nhắc nhở",
}
