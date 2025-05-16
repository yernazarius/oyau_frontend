"use client"
import { useState } from "react"
import { Eye, EyeOff, LogIn } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { register, RegisterData, login } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    phone: "",
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

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Все поля обязательны для заполнения")
      return
    }

    if (formData.password !== formData.repeatPassword) {
      setError("Пароли не совпадают")
      return
    }

    setIsLoading(true)

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()

      const registerData: RegisterData = {
        email: formData.email,
        password: formData.password,
        name: fullName,
        phone: formData.phone || undefined,
        is_active: true,
        is_superuser: false,
        is_verified: false,
        is_owner: false,
      }

      // Register the user
      const userId = await register(registerData)

      // If registration was successful, proceed to workspace creation
      if (userId) {
        // No need to explicitly login as the cookie is already set from registration
        router.push("/workspace-creation")
      } else {
        // Registration succeeded but couldn't get user ID
        console.warn("User registered but couldn't get user ID. Logging in explicitly...")

        // Try to login to ensure we get the cookie and can extract user ID
        await login(formData.email, formData.password)
        router.push("/workspace-creation")
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Registration error:", err)
      if (err.response?.data?.detail) {
        setError(Array.isArray(err.response.data.detail)
          ? err.response.data.detail[0].msg
          : err.response.data.detail)
      } else {
        setError("Ошибка при регистрации. Пожалуйста, попробуйте снова.")
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
              <h1 className="text-4xl font-bold">Начнем!</h1>
              <p className="text-gray-500 text-lg">создайте свой аккаунт</p>
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
            {/* First Name */}
            <div>
              <label className="text-sm text-gray-500">Имя</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Какое-то Имя"
                className="w-full border rounded-xl p-3 outline-none"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm text-gray-500">Фамилия</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Какая-то Фамилия"
                className="w-full border rounded-xl p-3 outline-none"
              />
            </div>

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

            {/* Phone */}
            <div>
              <label className="text-sm text-gray-500">Телефон (необязательно)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+7 (XXX) XXX-XX-XX"
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

            {/* Repeat Password */}
            <div className="relative">
              <label className="text-sm text-gray-500">Повторите Пароль</label>
              <input
                type={showRepeatPassword ? "text" : "password"}
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                placeholder="********"
                className="w-full border rounded-xl p-3 pr-10 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showRepeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#5885EA] text-white w-full p-3 rounded-xl text-center font-medium hover:bg-[#3f6eea] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-500 pt-2">
              Уже есть аккаунт?{" "}
              <Link
                href="/login"
                className="text-[#5885EA] inline-flex items-center gap-1 hover:underline"
              >
                <LogIn size={16} />
                Войти
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Background or Content */}
      <div className="bg-[#5885EA] w-1/2 h-[100vh] text-white text-left flex flex-col items-center justify-start space-y-12  px-24 py-32 ">
        <Image
          src="/logo-white.svg"
          width={200}
          height={200}
          alt="Logo"
          className="w-4/5 z-10"
        />
        <div>
          <h3 className="font-bold text-2xl">
            1 шаг до эффективной работы бизнеса
          </h3>
          <p className="text-2xl mt-16">
            Оставьте контакты и наш менеджер расскажет как использовать CRM в
            вашем центре
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