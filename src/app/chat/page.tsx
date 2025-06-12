"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import MainHeader from "@/components/Header/MainHeader"
import Sidebar from "@/components/Sidebar/Sidebar"
import { getClients, ClientRead } from "@/lib/client"

// Message interface based on the API documentation
interface Message {
  type: "incoming" | "outgoing"
  idMessage: string
  timestamp: number
  typeMessage: string
  chatId: string
  textMessage?: string
  downloadUrl?: string
  caption?: string
  fileName?: string
  mimeType?: string
  statusMessage?: string
  sendByApi?: boolean
  senderId?: string
  senderName?: string
  senderContactName?: string
  extendedTextMessage?: {
    text?: string
    description?: string
    title?: string
  }
  isEdited?: boolean
  isDeleted?: boolean
}

interface ContactInfo {
  avatar?: string
  name?: string
}

interface Contact {
  phone: string
  name: string
  id: number
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const idInstance = searchParams.get("idInstance") || ""
  const apiTokenInstance = searchParams.get("apiTokenInstance") || ""
  const phone = searchParams.get("phone") || ""

  const [messages, setMessages] = useState<Message[]>([])
  const [outgoing, setOutgoing] = useState("")
  const [info, setInfo] = useState<ContactInfo>({})
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!idInstance || !apiTokenInstance || !phone) {
      router.push("/sign-in")
    }
  }, [idInstance, apiTokenInstance, phone, router])

  const fetchMessages = async () => {
    if (!idInstance || !apiTokenInstance || !phone) return

    setLoading(true)
    try {
      const response = await fetch(
        `https://7105.api.greenapi.com/waInstance${encodeURIComponent(idInstance)}/getChatHistory/${encodeURIComponent(apiTokenInstance)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId: `${phone}@c.us`,
            count: 50  // Fetch more messages to ensure we have enough valid ones
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }

      const data = await response.json()

      // Filter out deleted messages and messages with missing required properties
      const filteredMessages = data
        .filter((msg) => !msg.isDeleted && msg.timestamp && msg.idMessage)
        .slice(0, 20)

      // Sort messages by timestamp (oldest first)
      const sortedMessages = filteredMessages.sort((a, b) => a.timestamp - b.timestamp)

      setMessages(sortedMessages)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch(
          `https://7105.api.greenapi.com/waInstance${encodeURIComponent(idInstance)}/GetContactInfo/${encodeURIComponent(apiTokenInstance)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId: `${phone}@c.us` }),
          }
        )

        if (!response.ok) {
          throw new Error("Failed to get contact info")
        }

        const contactInfo = await response.json()
        setInfo(contactInfo)
      } catch (error) {
        console.error("Failed to get contact info:", error)
      }
    }

    const fetchContacts = async () => {
      try {
        const clientsData = await getClients()

        const formattedContacts: Contact[] = clientsData
          .filter((client: ClientRead) => client.phone)
          .map((client: ClientRead) => ({
            id: client.id,
            phone: client.phone!,
            name: `${client.name} ${client.surname}`.trim()
          }))

        setContacts(formattedContacts)
        setFilteredContacts(formattedContacts)
      } catch (error) {
        console.error("Failed to fetch contacts:", error)
        setContacts([])
        setFilteredContacts([])
      }
    }

    fetchInfo()
    fetchContacts()
    fetchMessages()

    // Set up WebSocket connection for real-time messages
    const socket = new WebSocket("wss://ws.oyau.kz")

    socket.onopen = () => {
      console.log("Connected to WebSocket server")
    }

    socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data)
      const chatId = parsed?.senderData?.chatId

      if (chatId === `${phone}@c.us`) {
        // Trigger refresh when receiving a new message for the current chat
        setRefreshTrigger(prev => prev + 1)
      }
    }

    return () => socket.close()
  }, [idInstance, apiTokenInstance, phone, refreshTrigger])

  useEffect(() => {
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
    )
    setFilteredContacts(filtered)
  }, [searchQuery, contacts])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!outgoing.trim()) return

    try {
      const response = await fetch(
        `https://7105.api.greenapi.com/waInstance${encodeURIComponent(idInstance)}/sendMessage/${encodeURIComponent(apiTokenInstance)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId: `${phone}@c.us`,
            message: outgoing,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      console.log("Successfully sent message:", data)

      setOutgoing("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px"
        textareaRef.current.focus()
      }

      // Refresh messages after sending
      setTimeout(() => {
        fetchMessages()
      }, 1000)
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "40px"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }

  const handleContactClick = (contactPhone: string) => {
    const newUrl = new URLSearchParams(window.location.search)
    newUrl.set("phone", contactPhone.replace("+", ""))
    router.push(`/chat?${newUrl.toString()}`)
  }

  const formatTimestamp = (timestamp: number) => {
    // Check if timestamp is valid
    if (!timestamp) {
      return "Unknown time"
    }

    try {
      const date = new Date(timestamp * 1000)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Unknown time"
      }

      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const isToday = date.toDateString() === today.toDateString()
      const isYesterday = date.toDateString() === yesterday.toDateString()

      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else if (isYesterday) {
        return `Вчера, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      } else {
        return `${date.toLocaleDateString([], { day: '2-digit', month: '2-digit' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Unknown time"
    }
  }
  const getMessageContent = (msg) => {
    if (!msg) return "[Ошибка сообщения]"

    if (msg.textMessage) {
      return msg.textMessage
    } else if (msg.extendedTextMessage?.text) {
      return msg.extendedTextMessage.text
    } else if (msg.caption) {
      return msg.caption
    } else if (msg.typeMessage === "imageMessage") {
      return "[Изображение]"
    } else if (msg.typeMessage === "videoMessage") {
      return "[Видео]"
    } else if (msg.typeMessage === "documentMessage") {
      return `[Документ: ${msg.fileName || "без имени"}]`
    } else if (msg.typeMessage === "audioMessage") {
      return "[Аудио сообщение]"
    } else if (msg.typeMessage === "stickerMessage") {
      return "[Стикер]"
    } else if (msg.typeMessage === "locationMessage") {
      return "[Местоположение]"
    } else if (msg.typeMessage === "contactMessage") {
      return "[Контакт]"
    } else if (msg.typeMessage === "pollMessage") {
      return "[Опрос]"
    } else if (msg.typeMessage === "ptvMessage") {
      return "[Временное сообщение]"
    } else {
      return "[Сообщение]"
    }
  }
  const getStatusIcon = (status?: string) => {
    if (!status) return null

    switch (status) {
      case "pending":
        return <span className="text-gray-400">⌛</span>
      case "sent":
        return <span className="text-gray-500">✓</span>
      case "delivered":
        return <span className="text-blue-500">✓✓</span>
      case "read":
        return <span className="text-green-500">✓✓</span>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <MainHeader />
      <main className="flex flex-grow overflow-hidden">
        <Sidebar />
        <div className="flex flex-grow">
          {/* Contacts Sidebar */}
          <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">Контакты</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск контактов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Контакты не найдены
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => handleContactClick(contact.phone)}
                    className={`p-3 hover:bg-gray-100 cursor-pointer transition-colors ${contact.phone.replace("+", "") === phone
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "border-l-4 border-transparent"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                          {contact.name.charAt(0).toUpperCase() || contact.phone.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {contact.name || contact.phone}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{contact.phone}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* Chat Area */}
          <div className="flex-grow flex flex-col h-full bg-white shadow-sm">
            {/* Chat Header */}
            <div className="px-6 py-3 border-b border-gray-200 flex items-center">
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                  {info.name?.charAt(0).toUpperCase() || phone.charAt(0)}
                </div>
                <div className="ml-3">
                  <h2 className="font-medium text-gray-900">{info.name || phone}</h2>
                  <p className="text-xs text-gray-500">
                    {messages.length > 0 ? "В сети" : "Статус неизвестен"}
                  </p>
                </div>
              </div>
              <button
                className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors flex items-center"
                onClick={fetchMessages}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Загрузка
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Обновить
                  </span>
                )}
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="loader animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg className="h-16 w-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p>Нет сообщений</p>
                  <p className="text-sm">Начните переписку прямо сейчас</p>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  {messages.map((msg, idx) => {
                    if (!msg.idMessage || !msg.timestamp) return null

                    const isOutgoing = msg.type === "outgoing"
                    return (
                      <div
                        key={msg.idMessage || idx}
                        className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] shadow-sm ${isOutgoing
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                            }`}
                        >
                          <div className="flex flex-col">
                            {msg.typeMessage === "imageMessage" && msg.downloadUrl && (
                              <div className="mb-2">
                                <a
                                  href={msg.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block rounded-md overflow-hidden"
                                >
                                  <div className="bg-gray-100 h-40 flex items-center justify-center">
                                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                </a>
                              </div>
                            )}
                            <span className="break-words">{getMessageContent(msg)}</span>
                            <div className={`flex justify-end items-center mt-1 text-xs ${isOutgoing ? "text-blue-200" : "text-gray-400"
                              }`}>
                              <span>{formatTimestamp(msg.timestamp)}</span>
                              {isOutgoing && <span className="ml-1">{getStatusIcon(msg.statusMessage)}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-end rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
                <textarea
                  ref={textareaRef}
                  placeholder="Введите сообщение..."
                  className="flex-grow px-3 py-2 resize-none focus:outline-none min-h-[40px] max-h-[120px]"
                  value={outgoing}
                  onInput={handleInput}
                  onChange={(e) => setOutgoing(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 h-[40px] transition-colors flex items-center justify-center"
                  onClick={handleSend}
                  disabled={!outgoing.trim()}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}