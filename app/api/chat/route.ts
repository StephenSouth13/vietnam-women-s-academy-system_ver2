import { type NextRequest, NextResponse } from "next/server"
import type { ChatMessage, ChatConversation, ChatUser } from "@/lib/chat-types"

// Mock data
const mockUsers: ChatUser[] = [
  {
    id: "teacher1",
    fullName: "TS. Nguyễn Văn A",
    avatar: "/placeholder.svg",
    role: "teacher",
    isOnline: true,
    department: "Công nghệ thông tin",
  },
  {
    id: "student1",
    fullName: "Trần Thị B",
    avatar: "/placeholder.svg",
    role: "student",
    isOnline: false,
    lastSeen: "2024-01-15T10:30:00Z",
    studentId: "SV001",
  },
  {
    id: "student2",
    fullName: "Lê Văn C",
    avatar: "/placeholder.svg",
    role: "student",
    isOnline: true,
    studentId: "SV002",
  },
]

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: "teacher1",
    receiverId: "student1",
    content: "Chào em, thầy cần trao đổi về bài tập.",
    timestamp: "2024-01-15T09:00:00Z",
    isRead: true,
    type: "text",
  },
  {
    id: "2",
    senderId: "student1",
    receiverId: "teacher1",
    content: "Dạ, em nghe thầy ạ.",
    timestamp: "2024-01-15T09:05:00Z",
    isRead: false,
    type: "text",
  },
]

const mockConversations: ChatConversation[] = [
  {
    id: "conv1",
    participants: ["teacher1", "student1"],
    lastMessage: mockMessages[1],
    lastActivity: "2024-01-15T09:05:00Z",
    unreadCount: 1,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const userId = searchParams.get("userId")

    switch (type) {
      case "conversations":
        const userConversations = mockConversations.filter((conv) => conv.participants.includes(userId || ""))
        return NextResponse.json({
          success: true,
          conversations: userConversations,
        })

      case "messages":
        const conversationId = searchParams.get("conversationId")
        const conversationMessages = mockMessages.filter((msg) => {
          const conversation = mockConversations.find((conv) => conv.id === conversationId)
          return (
            conversation &&
            ((msg.senderId === conversation.participants[0] && msg.receiverId === conversation.participants[1]) ||
              (msg.senderId === conversation.participants[1] && msg.receiverId === conversation.participants[0]))
          )
        })
        return NextResponse.json({
          success: true,
          messages: conversationMessages,
        })

      case "users":
        const searchQuery = searchParams.get("search")
        let filteredUsers = mockUsers
        if (searchQuery) {
          filteredUsers = mockUsers.filter(
            (user) =>
              user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (user.studentId && user.studentId.toLowerCase().includes(searchQuery.toLowerCase())),
          )
        }
        return NextResponse.json({
          success: true,
          users: filteredUsers,
        })

      default:
        return NextResponse.json({ success: false, error: "Invalid type parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { senderId, receiverId, content, type = "text" } = await request.json()

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
      type,
    }

    mockMessages.push(newMessage)

    // Update or create conversation
    let conversation = mockConversations.find(
      (conv) => conv.participants.includes(senderId) && conv.participants.includes(receiverId),
    )

    if (!conversation) {
      conversation = {
        id: `conv_${Date.now()}`,
        participants: [senderId, receiverId],
        lastMessage: newMessage,
        lastActivity: newMessage.timestamp,
        unreadCount: 1,
      }
      mockConversations.push(conversation)
    } else {
      conversation.lastMessage = newMessage
      conversation.lastActivity = newMessage.timestamp
      conversation.unreadCount += 1
    }

    return NextResponse.json({
      success: true,
      message: newMessage,
      conversation,
    })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}
