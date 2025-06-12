"use client"

import React from "react"
import Calendar from "@/components/Calendar/Calendar"
import Link from "next/link"
import WorkspaceInfo from "@/components/Workspace/WorkspaceInfo"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar/Sidebar"
import MainHeader from "@/components/Header/MainHeader"

export default function BookingPage() {
  const router = useRouter()



  return (
    <div className="flex flex-col h-screen">
      <MainHeader />
      <main className="flex flex-grow overflow-hidden">
        <Sidebar />
        <div className="flex-grow p-6 overflow-hidden">
          <h1 className="text-2xl font-bold mb-6">Главная страница</h1>
          <div className="h-full">
            <Calendar />
          </div>
        </div>
      </main>
    </div>
  )
}