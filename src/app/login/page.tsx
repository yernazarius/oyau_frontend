// app/login/page.tsx
"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import styles from "./login.module.css"

export default function LoginPage() {
  const [idInstance, setIdInstance] = useState("")
  const [apiTokenInstance, setApiTokenInstance] = useState("")
  const router = useRouter()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const response = await fetch(
        `https://7105.api.greenapi.com/waInstance${encodeURIComponent(idInstance)}/getSettings/${encodeURIComponent(apiTokenInstance)}`,
      )

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      console.log("Login successful:", data)

      // Navigate to create chat page with credentials
      router.push(
        `/createchat?idInstance=${encodeURIComponent(idInstance)}&apiTokenInstance=${encodeURIComponent(apiTokenInstance)}`,
      )
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <div className="page-container">
      <div className="form-card">
        <h1 className="form-title">Login</h1>
        <form className="form-content" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="idInstance"
              className="form-input"
              placeholder="idInstance"
              value={idInstance}
              onChange={(e) => setIdInstance(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="apiTokenInstance"
              className="form-input"
              placeholder="apiTokenInstance"
              value={apiTokenInstance}
              onChange={(e) => setApiTokenInstance(e.target.value)}
            />
          </div>
          <button type="submit" className="form-button">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
