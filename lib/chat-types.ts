export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
  type: "text" | "file" | "image"
  fileUrl?: string
  fileName?: string
}

export interface ChatConversation {
  id: string
  participants: string[]
  lastMessage?: ChatMessage
  lastActivity: string
  unreadCount: number
}

export interface ChatUser {
  id: string
  fullName: string
  avatar?: string
  role: "student" | "teacher"
  isOnline: boolean
  lastSeen?: string
  studentId?: string
  department?: string
}

export interface ChatState {
  isOpen: boolean
  activeConversation?: string
  conversations: ChatConversation[]
  messages: { [conversationId: string]: ChatMessage[] }
  users: ChatUser[]
  unreadTotal: number
}
