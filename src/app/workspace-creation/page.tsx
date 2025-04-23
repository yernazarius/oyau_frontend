"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createWorkspace, getUserId } from "@/lib/auth"

export default function WorkspaceCreation() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [userId, setUserId] = useState<number | null>(null)

	const [formData, setFormData] = useState({
		name: "",
		location: "",
	})

	useEffect(() => {
		// Try to get user ID from storage
		const currentUserId = getUserId()

		if (currentUserId) {
			setUserId(currentUserId)
		} else {
			// If no user ID found, redirect back to registration
			router.push("/")
		}
	}, [router])

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

		if (!formData.name) {
			setError("Введите название рабочего пространства")
			return
		}

		if (!userId) {
			setError("Ошибка: ID пользователя не найден")
			return
		}

		setIsLoading(true)

		try {
			await createWorkspace({
				name: formData.name,
				location: formData.location || "Default Location",
				user_id: userId
			})

			// Redirect to the main app after workspace creation
			router.push("/app")
		} catch (err: any) {
			console.error("Workspace creation error:", err)
			if (err.response?.data?.detail) {
				setError(Array.isArray(err.response.data.detail)
					? err.response.data.detail[0].msg
					: err.response.data.detail)
			} else {
				setError("Ошибка при создании рабочего пространства. Пожалуйста, попробуйте снова.")
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
					<div className="mb-8">
						<h1 className="text-4xl font-bold">Создание рабочего пространства</h1>
						<p className="text-gray-500 text-lg mt-2">
							Укажите информацию о вашем бизнесе
						</p>
					</div>

					{error && (
						<div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
							{error}
						</div>
					)}

					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<label className="text-sm text-gray-500">Название рабочего пространства</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="Например: Моя Компания"
								className="w-full border rounded-xl p-3 outline-none mt-1"
							/>
							<p className="text-xs text-gray-400 mt-1">
								Это название будет отображаться в вашем профиле и рабочем пространстве
							</p>
						</div>

						<div>
							<label className="text-sm text-gray-500">Местоположение (необязательно)</label>
							<input
								type="text"
								name="location"
								value={formData.location}
								onChange={handleChange}
								placeholder="Например: Москва"
								className="w-full border rounded-xl p-3 outline-none mt-1"
							/>
						</div>

						<div className="pt-4">
							<button
								type="submit"
								className="bg-[#5885EA] text-white w-full p-3 rounded-xl text-center font-medium hover:bg-[#3f6eea] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
								disabled={isLoading}
							>
								{isLoading ? "Создание..." : "Создать рабочее пространство"}
							</button>
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
						Последний шаг настройки
					</h3>
					<p className="text-2xl mt-16">
						Создайте рабочее пространство для вашей команды и начните эффективно управлять бизнесом
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