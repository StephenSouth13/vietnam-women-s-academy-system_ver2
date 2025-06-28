import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { FloatingChat } from "@/components/chat/floating-chat"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hệ thống chấm điểm rèn luyện sinh viên - Phân hiệu Học viện Phụ nữ Việt Nam",
  description: "Hệ thống quản lý và chấm điểm rèn luyện sinh viên",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <FloatingChat />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
