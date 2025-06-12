// app/createchat/page.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./createchat.module.css";

export default function CreateChatPage() {
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const idInstance = searchParams.get("idInstance") || "";
  const apiTokenInstance = searchParams.get("apiTokenInstance") || "";

  // Redirect to login if credentials aren't available
  useEffect(() => {
    if (!idInstance || !apiTokenInstance) {
      router.push("/sign-in");
    }
  }, [idInstance, apiTokenInstance, router]);

  const handlePhoneSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://7105.api.greenapi.com/waInstance${encodeURIComponent(idInstance)}/checkWhatsapp/${encodeURIComponent(apiTokenInstance)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phone,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data?.existsWhatsapp) {
        console.log("Chat created successfully");
        router.push(
          `/chat?idInstance=${encodeURIComponent(idInstance)}&apiTokenInstance=${encodeURIComponent(apiTokenInstance)}&phone=${encodeURIComponent(phone)}`,
        );
      } else {
        console.error("Whatsapp user with such number does not exist");
        // Add visible error message here
      }
    } catch (error) {
      console.error("Failed to create a chat:", error);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1 className="form-title">Create a new chat</h1>
        <form className="form-content" onSubmit={handlePhoneSubmit}>
          <div className="form-group">
            <input
              type="tel"
              id="phone"
              className="form-input"
              placeholder="77776665544"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button type="submit" className="form-button">
            Create chat
          </button>
        </form>
      </div>
    </div>
  );
}
