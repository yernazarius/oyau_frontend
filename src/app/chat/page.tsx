// app/chat/page.tsx
"use client"

import { useEffect, useState, useRef, FormEvent, ChangeEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import styles from "./chat.module.css"
import MainHeader from "@/components/Header/MainHeader"
import Sidebar from "@/components/Sidebar/Sidebar"

interface Message {
  text?: string
  type?: "sender" | "recipient"
  index?: number
}

interface ContactInfo {
  avatar?: string
  name?: string
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const idInstance = searchParams.get("idInstance") || ""
  const apiTokenInstance = searchParams.get("apiTokenInstance") || ""
  const phone = searchParams.get("phone") || ""

  const [messages, setMessages] = useState<Message[]>([{}])
  const [outgoing, setOutgoing] = useState("")
  const [info, setInfo] = useState<ContactInfo>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Redirect to login if credentials aren't available
  useEffect(() => {
    if (!idInstance || !apiTokenInstance || !phone) {
      router.push("/sign-in")
    }
  }, [idInstance, apiTokenInstance, phone, router])

  useEffect(() => {
    // Fetch contact info
    const fetchInfo = async () => {
      try {
        const response = await fetch(
          `https://7105.api.greenapi.com/waInstance${encodeURIComponent(idInstance)}/GetContactInfo/${encodeURIComponent(apiTokenInstance)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chatId: `${phone}@c.us`,
            }),
          },
        )

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        const contactInfo = await response.json()
        setInfo(contactInfo)
      } catch (error) {
        console.error("Failed to get contact info:", error)
      }
    }

    fetchInfo()

    // Connect to WebSocket server
    const socket = new WebSocket("ws://localhost:5000")

    socket.onopen = () => {
      console.log("Connected to WebSocket server")
    }

    socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data)
      const messageText = parsed?.messageData?.textMessageData?.textMessage
      const chatId = parsed?.senderData?.chatId

      if (chatId == `${phone}@c.us`) {
        setMessages((prev) => [
          ...prev,
          { text: messageText, type: "recipient", index: prev.length },
        ])
      }
    }

    return () => socket.close()
  }, [idInstance, apiTokenInstance, phone])

  const handleSend = async () => {
    if (!outgoing.trim()) return

    try {
      const response = await fetch(
        `https://7105.api.greenapi.com/waInstance${encodeURIComponent(idInstance)}/sendMessage/${encodeURIComponent(apiTokenInstance)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: `${phone}@c.us`,
            message: outgoing,
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      console.log("Successfully sent message:", data)

      setOutgoing("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "20px"
        textareaRef.current.focus()
      }

      setMessages((prev) => [
        ...prev,
        { text: outgoing, type: "sender", index: prev.length },
      ])
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
      textarea.style.height = "20px"
      textarea.style.height = textarea.scrollHeight - 20 + "px"
    }
  }

  return (

    <div className="flex flex-col h-screen">
      <MainHeader />
      <main className="flex flex-grow overflow-hidden">
        <Sidebar />
        <div className="flex-grow p-6 overflow-hidden">
          <h1 className="text-2xl font-bold mb-6">Сообщения</h1>
          <div className="h-full">
            <div className="chat-container">
                <div className="header">
          {info.avatar ? (
            <Image
              src={info.avatar}
              alt="avatar"
              width={40}
              height={40}
              className="avatar"  
            />
          ) : (
            <div className="avatar-placeholder">
              {/* You can use a placeholder avatar or initials here */}
              {info.name?.charAt(0) || phone.charAt(0)}
            </div>
          )}
          <span className="username">{info.name || phone}</span>
        </div>

        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type || ""}`}>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>

        <div className="input-area">
          <textarea
            ref={textareaRef}
            placeholder="Type a message"
            className="message-input"
            value={outgoing}
            rows={1}
            onInput={handleInput}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setOutgoing(e.target.value)
            }
            onKeyDown={handleKeyDown}
            style={{ marginRight: "10px" }}
          />
          <button type="button" className="send-button" onClick={handleSend}>
            Send
          </button>
        </div>
            </div>
          </div>
        </div>
      </main>
    </div>

  )
}
