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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, MapPin, Edit, Trash2 } from "lucide-react"
import type { CalendarEvent, CalendarView } from "@/lib/calendar-types"
import { eventTypeColors, eventTypeLabels } from "@/lib/calendar-types"

export default function StudentCalendarPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [view, setView] = useState<CalendarView>({ type: "month", date: new Date() })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [loading, setLoading] = useState(false)

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    type: "personal" as CalendarEvent["type"],
    location: "",
    isAllDay: false,
    reminder: 30,
  })

  // Fetch events
  const fetchEvents = async () => {
    try {
      const startOfMonth = new Date(view.date.getFullYear(), view.date.getMonth(), 1)
      const endOfMonth = new Date(view.date.getFullYear(), view.date.getMonth() + 1, 0)

      const response = await fetch(
        `/api/calendar?userId=${user?.id}&startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`,
      )
      const data = await response.json()

      if (data.success) {
        setEvents(data.events)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    }
  }

  // Create or update event
  const saveEvent = async () => {
    if (!eventForm.title.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tiêu đề sự kiện",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const eventData = {
        ...eventForm,
        createdBy: user?.id,
        attendees: eventForm.type === "shared" ? [] : undefined,
      }

      const response = await fetch("/api/calendar", {
        method: editingEvent ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEvent ? { id: editingEvent.id, ...eventData } : eventData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Thành công",
          description: data.message,
        })
        setShowEventDialog(false)
        resetForm()
        fetchEvents()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu sự kiện",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete event
  const deleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/calendar?id=${eventId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Thành công",
          description: data.message,
        })
        fetchEvents()
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa sự kiện",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setEventForm({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      type: "personal",
      location: "",
      isAllDay: false,
      reminder: 30,
    })
    setEditingEvent(null)
  }

  const openEditDialog = (event: CalendarEvent) => {
    setEventForm({
      title: event.title,
      description: event.description || "",
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      type: event.type,
      location: event.location || "",
      isAllDay: event.isAllDay,
      reminder: event.reminder || 30,
    })
    setEditingEvent(event)
    setShowEventDialog(true)
  }

  // Generate calendar grid
  const generateCalendarDays = () => {
    const year = view.date.getFullYear()
    const month = view.date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return events.filter((event) => event.startDate === dateStr)
  }

  const getTodayEvents = () => {
    const today = new Date().toISOString().split("T")[0]
    return events.filter((event) => event.startDate === today)
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    return events
      .filter((event) => {
        const eventDate = new Date(event.startDate)
        return eventDate > today && eventDate <= nextWeek
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(view.date)
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    setView({ ...view, date: newDate })
  }

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user, view.date])

  const calendarDays = generateCalendarDays()
  const todayEvents = getTodayEvents()
  const upcomingEvents = getUpcomingEvents()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch cá nhân</h1>
          <p className="text-gray-600 mt-2">Quản lý lịch trình và sự kiện cá nhân</p>
        </div>
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#005BAC] hover:bg-blue-700" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo sự kiện
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}</DialogTitle>
              <DialogDescription>
                {editingEvent ? "Cập nhật thông tin sự kiện" : "Thêm sự kiện vào lịch của bạn"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Nhập tiêu đề sự kiện"
                />
              </div>
              <div>
                <Label htmlFor="type">Loại sự kiện</Label>
                <Select
                  value={eventForm.type}
                  onValueChange={(value: CalendarEvent["type"]) => setEventForm({ ...eventForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Cá nhân</SelectItem>
                    <SelectItem value="reminder">Nhắc nhở</SelectItem>
                    <SelectItem value="deadline">Hạn chót</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={eventForm.startDate}
                    onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value, endDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={eventForm.endDate}
                    onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                  />
                </div>
              </div>
              {!eventForm.isAllDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Giờ bắt đầu</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={eventForm.startTime}
                      onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Giờ kết thúc</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={eventForm.endTime}
                      onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                    />
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="location">Địa điểm</Label>
                <Input
                  id="location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="Nhập địa điểm"
                />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Mô tả chi tiết sự kiện"
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEventDialog(false)}>
                Hủy
              </Button>
              <Button onClick={saveEvent} disabled={loading} className="bg-[#005BAC] hover:bg-blue-700">
                {loading ? "Đang lưu..." : editingEvent ? "Cập nhật" : "Tạo sự kiện"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {view.date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === view.date.getMonth()
                  const isToday = day.toDateString() === new Date().toDateString()
                  const dayEvents = getEventsForDate(day)

                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-1 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        isCurrentMonth ? "bg-white" : "bg-gray-50"
                      } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div
                        className={`text-sm font-medium ${
                          isCurrentMonth ? "text-gray-900" : "text-gray-400"
                        } ${isToday ? "text-blue-600" : ""}`}
                      >
                        {day.getDate()}
                      </div>
                      <div className="space-y-1 mt-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="text-xs p-1 rounded truncate"
                            style={{
                              backgroundColor: eventTypeColors[event.type] + "20",
                              color: eventTypeColors[event.type],
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">+{dayEvents.length - 2} khác</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sự kiện hôm nay</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">Không có sự kiện nào hôm nay</p>
              ) : (
                <div className="space-y-3">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div
                        className="w-3 h-3 rounded-full mt-1"
                        style={{ backgroundColor: eventTypeColors[event.type] }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          {event.isAllDay ? "Cả ngày" : `${event.startTime} - ${event.endTime}`}
                        </div>
                        {event.location && (
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                        <Badge variant="outline" className="mt-2 text-xs">
                          {eventTypeLabels[event.type]}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditDialog(event)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-600 hover:text-red-700"
                          onClick={() => deleteEvent(event.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sự kiện sắp tới</CardTitle>
              <CardDescription>7 ngày tới</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">Không có sự kiện nào sắp tới</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div
                        className="w-3 h-3 rounded-full mt-1"
                        style={{ backgroundColor: eventTypeColors[event.type] }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.startDate).toLocaleDateString("vi-VN", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                          {!event.isAllDay && ` • ${event.startTime}`}
                        </div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {eventTypeLabels[event.type]}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
