"use client"
import { useState } from "react"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { login } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.email || !formData.password) {
      setError("Пожалуйста, введите email и пароль")
      return
    }

    setIsLoading(true)

    try {
      // Using the login function from auth.ts which now supports form-urlencoded format
      await login(formData.email, formData.password)

      // Redirect after successful login
      router.push("/app")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login error:", err)
      if (err.response?.data?.detail) {
        setError(Array.isArray(err.response.data.detail)
          ? err.response.data.detail[0].msg
          : err.response.data.detail)
      } else {
        setError("Неверный email или пароль")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-row font-sans">
      {/* Left Side - Form */}
      <div className="w-1/2 h-[100vh] flex items-center justify-center bg-white">
        <div className="w-full max-w-md px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold">Добро пожаловать!</h1>
              <p className="text-gray-500 text-lg">войдите в свой аккаунт</p>
            </div>
            <button className="border border-blue-500 text-blue-500 text-sm px-4 py-1 rounded-lg hover:bg-blue-50 transition">
              Русский
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="text-sm text-gray-500">E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="some@email.com"
                className="w-full border rounded-xl p-3 outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-sm text-gray-500">Пароль</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full border rounded-xl p-3 pr-10 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-[#5885EA] hover:underline">
                Забыли пароль?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#5885EA] text-white w-full p-3 rounded-xl text-center font-medium hover:bg-[#3f6eea] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Вход..." : "Войти"}
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center text-sm text-gray-500 pt-2">
              Нет аккаунта?{" "}
              <Link
                href="/sign-up"
                className="text-[#5885EA] inline-flex items-center gap-1 hover:underline"
              >
                <UserPlus size={16} />
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Background or Content */}
      <div className="bg-[#5885EA] w-1/2 h-[100vh] text-white text-left flex flex-col items-center justify-start space-y-12 px-24 py-32">
        <Image
          src="/logo-white.svg"
          width={200}
          height={200}
          alt="Logo"
          className="w-4/5 z-10"
        />
        <div>
          <h3 className="font-bold text-2xl">
            Эффективное управление для вашего бизнеса
          </h3>
          <p className="text-2xl mt-16">
            Войдите в свой аккаунт, чтобы продолжить работу с нашей CRM-системой
          </p>
        </div>
        <Image
          src="/login_line.png"
          width={200}
          height={200}
          alt="Logo"
          className="w-[35%] right-0 bottom-0 z-10 absolute"
        />
      </div>
    </div>
  )
}