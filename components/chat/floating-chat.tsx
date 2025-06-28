"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, X, Send, Search, Minimize2, Maximize2, Circle, Users } from "lucide-react"
import type { ChatMessage, ChatConversation, ChatUser } from "@/lib/chat-types"

export function FloatingChat() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState("conversations")
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [messages, setMessages] = useState<{ [key: string]: ChatMessage[] }>({})
  const [users, setUsers] = useState<ChatUser[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [unreadTotal, setUnreadTotal] = useState(0)

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/chat?type=conversations&userId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setConversations(data.conversations)
        const total = data.conversations.reduce((sum: number, conv: ChatConversation) => sum + conv.unreadCount, 0)
        setUnreadTotal(total)
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    }
  }

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chat?type=messages&conversationId=${conversationId}`)
      const data = await response.json()

      if (data.success) {
        setMessages((prev) => ({
          ...prev,
          [conversationId]: data.messages,
        }))
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  // Fetch users
  const fetchUsers = async (search = "") => {
    try {
      const response = await fetch(`/api/chat?type=users&search=${search}`)
      const data = await response.json()

      if (data.success) {
        // Filter out current user
        const filteredUsers = data.users.filter((u: ChatUser) => u.id !== user?.id)
        setUsers(filteredUsers)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !user) return

    try {
      const conversation = conversations.find((c) => c.id === activeConversation)
      if (!conversation) return

      const receiverId = conversation.participants.find((p) => p !== user.id)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          receiverId,
          content: newMessage,
          type: "text",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessages((prev) => ({
          ...prev,
          [activeConversation]: [...(prev[activeConversation] || []), data.message],
        }))
        setNewMessage("")
        fetchConversations() // Refresh conversations
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      toast({
        title: "Lỗi",
        description: "Không thể gửi tin nhắn",
        variant: "destructive",
      })
    }
  }

  // Start new conversation
  const startConversation = async (targetUser: ChatUser) => {
    if (!user) return

    // Check if conversation already exists
    const existingConv = conversations.find((conv) => conv.participants.includes(targetUser.id))

    if (existingConv) {
      setActiveConversation(existingConv.id)
      setActiveTab("conversations")
      if (!messages[existingConv.id]) {
        fetchMessages(existingConv.id)
      }
      return
    }

    // Create new conversation by sending first message
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: targetUser.id,
          content: "Xin chào!",
          type: "text",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setActiveConversation(data.conversation.id)
        setActiveTab("conversations")
        fetchConversations()
        fetchMessages(data.conversation.id)
      }
    } catch (error) {
      console.error("Failed to start conversation:", error)
    }
  }

  useEffect(() => {
    if (user && isOpen) {
      fetchConversations()
      fetchUsers()
    }
  }, [user, isOpen])

  useEffect(() => {
    if (activeConversation && !messages[activeConversation]) {
      fetchMessages(activeConversation)
    }
  }, [activeConversation])

  if (!user) return null

  const getOtherUser = (conversation: ChatConversation) => {
    const otherUserId = conversation.participants.find((p) => p !== user.id)
    return users.find((u) => u.id === otherUserId)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#005BAC] hover:bg-blue-700 shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadTotal > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadTotal > 99 ? "99+" : unreadTotal}
            </Badge>
          )}
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#005BAC] text-white rounded-t-lg">
            <CardTitle className="text-lg">Tin nhắn</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-600"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-600"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="flex-1 p-0 flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 m-2">
                  <TabsTrigger value="conversations" className="relative">
                    Tin nhắn
                    {unreadTotal > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs">{unreadTotal}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="contacts">
                    <Users className="h-4 w-4 mr-1" />
                    Danh bạ
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="conversations" className="flex-1 flex flex-col m-0">
                  {activeConversation ? (
                    // Chat View
                    <div className="flex-1 flex flex-col">
                      <div className="p-3 border-b flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => setActiveConversation(null)}>
                          ← Quay lại
                        </Button>
                        {(() => {
                          const conversation = conversations.find((c) => c.id === activeConversation)
                          const otherUser = conversation ? getOtherUser(conversation) : null
                          return otherUser ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={otherUser.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{otherUser.fullName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{otherUser.fullName}</div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Circle
                                    className={`h-2 w-2 ${otherUser.isOnline ? "fill-green-500 text-green-500" : "fill-gray-400 text-gray-400"}`}
                                  />
                                  {otherUser.isOnline ? "Đang hoạt động" : "Không hoạt động"}
                                </div>
                              </div>
                            </div>
                          ) : null
                        })()}
                      </div>

                      <ScrollArea className="flex-1 p-3">
                        <div className="space-y-3">
                          {(messages[activeConversation] || []).map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] p-2 rounded-lg text-sm ${
                                  message.senderId === user.id ? "bg-[#005BAC] text-white" : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                <div>{message.content}</div>
                                <div
                                  className={`text-xs mt-1 ${
                                    message.senderId === user.id ? "text-blue-100" : "text-gray-500"
                                  }`}
                                >
                                  {formatTime(message.timestamp)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      <div className="p-3 border-t">
                        <div className="flex gap-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            className="flex-1"
                          />
                          <Button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            size="icon"
                            className="bg-[#005BAC] hover:bg-blue-700"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Conversations List
                    <ScrollArea className="flex-1">
                      <div className="p-2">
                        {conversations.length === 0 ? (
                          <div className="text-center text-muted-foreground py-8">
                            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Chưa có cuộc trò chuyện nào</p>
                            <p className="text-sm">Hãy bắt đầu chat từ tab Danh bạ</p>
                          </div>
                        ) : (
                          conversations.map((conversation) => {
                            const otherUser = getOtherUser(conversation)
                            if (!otherUser) return null

                            return (
                              <div
                                key={conversation.id}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() => setActiveConversation(conversation.id)}
                              >
                                <div className="relative">
                                  <Avatar>
                                    <AvatarImage src={otherUser.avatar || "/placeholder.svg"} />
                                    <AvatarFallback>{otherUser.fullName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <Circle
                                    className={`absolute bottom-0 right-0 h-3 w-3 ${
                                      otherUser.isOnline
                                        ? "fill-green-500 text-green-500"
                                        : "fill-gray-400 text-gray-400"
                                    }`}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-sm truncate">{otherUser.fullName}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground truncate">
                                      {conversation.lastMessage?.content || "Chưa có tin nhắn"}
                                    </div>
                                    {conversation.unreadCount > 0 && (
                                      <Badge className="h-5 w-5 rounded-full bg-red-500 text-white text-xs">
                                        {conversation.unreadCount}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>

                <TabsContent value="contacts" className="flex-1 flex flex-col m-0">
                  <div className="p-3 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          fetchUsers(e.target.value)
                        }}
                        placeholder="Tìm kiếm người dùng..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {users.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Không tìm thấy người dùng</p>
                        </div>
                      ) : (
                        users.map((chatUser) => (
                          <div
                            key={chatUser.id}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                            onClick={() => startConversation(chatUser)}
                          >
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={chatUser.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{chatUser.fullName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <Circle
                                className={`absolute bottom-0 right-0 h-3 w-3 ${
                                  chatUser.isOnline ? "fill-green-500 text-green-500" : "fill-gray-400 text-gray-400"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{chatUser.fullName}</div>
                              <div className="text-xs text-muted-foreground">
                                {chatUser.role === "teacher" ? "Giảng viên" : "Sinh viên"}
                                {chatUser.studentId && ` • ${chatUser.studentId}`}
                                {chatUser.department && ` • ${chatUser.department}`}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          )}
        </Card>
      )}
    </>
  )
}
