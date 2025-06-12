"use client"
import { useState } from "react"
import Image from "next/image"
// import logoSrc from '/public/logo.svg'

import Link from "next/link"

export default function Header() {
  const [activeTab, setActiveTab] = useState("Главная")

  const menuItems = ["Главная", "О нас", "Вопросы", "Контакты"]

  return (
    <div className="mx-24 mt-16">
      <div className="flex justify-between items-center h-full">
        <div>
          <Image
            src="/Logo.png"
            width={200}
            height={200}
            alt="Logo"
            className="w-full m-auto"
          />
        </div>

        <div>
          <ul className="flex bg-white rounded-3xl h-12 items-center">
            {menuItems.map((item) => (
              <li
                key={item}
                onClick={() => setActiveTab(item)}
                className={`flex-1 flex justify-center items-center rounded-3xl h-full px-4 cursor-pointer transition-all duration-300 ${activeTab === item
                  ? "bg-[#5885EA] text-white"
                  : "hover:bg-gray-200"
                  }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Link href="/sign-in" className="mr-4">
            Войти
          </Link>
          <Link href="/sign-up">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  )
}
