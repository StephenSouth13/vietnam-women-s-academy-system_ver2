"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/providers/auth-provider"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Bell,
  Download,
  LogOut,
  GraduationCap,
  UserCheck,
  Calendar,
} from "lucide-react"

const studentNavItems = [
  { href: "/student/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/student/evaluation", label: "Phiếu đánh giá", icon: FileText },
  { href: "/student/calendar", label: "Lịch cá nhân", icon: Calendar },
  { href: "/student/notifications", label: "Thông báo", icon: Bell },
  { href: "/student/profile", label: "Hồ sơ", icon: UserCheck },
]

const teacherNavItems = [
  { href: "/teacher/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/teacher/students", label: "Quản lý sinh viên", icon: Users },
  { href: "/teacher/evaluations", label: "Chấm điểm", icon: FileText },
  { href: "/teacher/statistics", label: "Thống kê", icon: BarChart3 },
  { href: "/teacher/calendar", label: "Lịch cá nhân", icon: Calendar },
  { href: "/teacher/notifications", label: "Thông báo", icon: Bell },
  { href: "/teacher/export", label: "Xuất dữ liệu", icon: Download },
  { href: "/teacher/profile", label: "Hồ sơ", icon: UserCheck },
]

export function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()

  const navItems = user?.role === "teacher" ? teacherNavItems : studentNavItems

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (!user) return null

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#005BAC] text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-blue-400">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8" />
          <div>
            <h1 className="font-bold text-lg">Rèn Luyện SV</h1>
            <p className="text-blue-200 text-sm">Phân hiệu HV Phụ Nữ VN</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-400">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-600 text-white">{user.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.fullName}</p>
            <p className="text-blue-200 text-sm">{user.role === "teacher" ? "Giảng viên" : "Sinh viên"}</p>
            {user.studentId && <p className="text-blue-200 text-xs">{user.studentId}</p>}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-600 hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-blue-400">
        <Button
          variant="ghost"
          className="w-full justify-start text-blue-100 hover:bg-blue-600 hover:text-white"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
