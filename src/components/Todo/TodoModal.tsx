import React, { useState, useEffect } from "react"
import { Todo, CreateTodoPayload, UpdateTodoPayload } from "@/types/todo"
import { createTodo, updateTodo } from "@/lib/todo"

interface TodoModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: () => void
	todo: Todo | null
	userid: number
	workspaces: any[]
	currentWorkspaceId: number | null
}

const TodoModal: React.FC<TodoModalProps> = ({
	isOpen,
	onClose,
	onSave,
	todo,
	userid,
	workspaces,
	currentWorkspaceId
}) => {
	const [formData, setFormData] = useState<CreateTodoPayload>({
		title: "",
		description: "",
		client_name: "",
		is_completed: false,
		due_date: new Date().toISOString().split("T")[0],
		due_time: "15:00",
		author_id: userid || 1, // Ensure we always have a valid integer
		workspace_id: currentWorkspaceId || 1,
		executors: [userid || 1] // Ensure we always have a valid integer
	})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (todo) {
			setFormData({
				title: todo.title,
				description: todo.description,
				client_name: todo.client_name,
				is_completed: todo.is_completed,
				due_date: todo.due_date,
				due_time: todo.due_time,
				author_id: userid || 1, // Ensure we always have a valid integer
				workspace_id: todo.workspace_id,
				executors: todo.executors
			})
		} else {
			setFormData(prev => ({
				...prev,
				author_id: userid || 1, // Ensure we always have a valid integer
				workspace_id: currentWorkspaceId || 1,
				executors: [userid || 1] // Ensure we always have a valid integer
			}))
		}
	}, [todo, userid, currentWorkspaceId])

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target

		if (type === "checkbox") {
			const { checked } = e.target as HTMLInputElement
			setFormData(prev => ({ ...prev, [name]: checked }))
		} else {
			setFormData(prev => ({ ...prev, [name]: value }))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		setError(null)

		try {
			// Ensure all required integer fields have valid values
			const validatedFormData = {
				...formData,
				author_id: formData.author_id || 1,
				workspace_id: formData.workspace_id || 1,
				executors: formData.executors.length ? formData.executors : [1]
			};

			if (todo) {
				await updateTodo(todo.id, { ...validatedFormData, id: todo.id } as UpdateTodoPayload)
			} else {
				await createTodo(validatedFormData)
			}

			onSave()
		} catch (err) {
			console.error("Failed to save todo:", err)
			setError("Failed to save todo. Please try again.")
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-lg">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-medium">
						{todo ? "Редактировать задачу" : "Новая задача"}
					</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						✕
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Название задачи
							</label>
							<input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleInputChange}
								className="w-full border border-gray-300 rounded-md px-3 py-2"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Описание
							</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								className="w-full border border-gray-300 rounded-md px-3 py-2"
								rows={3}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Имя клиента
							</label>
							<input
								type="text"
								name="client_name"
								value={formData.client_name}
								onChange={handleInputChange}
								className="w-full border border-gray-300 rounded-md px-3 py-2"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Дата выполнения
								</label>
								<input
									type="date"
									name="due_date"
									value={formData.due_date}
									onChange={handleInputChange}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Время выполнения
								</label>
								<input
									type="time"
									name="due_time"
									value={formData.due_time}
									onChange={handleInputChange}
									className="w-full border border-gray-300 rounded-md px-3 py-2"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Рабочее пространство
							</label>
							<select
								name="workspace_id"
								value={formData.workspace_id}
								onChange={handleInputChange}
								className="w-full border border-gray-300 rounded-md px-3 py-2"
								required
							>
								{workspaces.map(workspace => (
									<option key={workspace.id} value={workspace.id}>
										{workspace.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Исполнители
							</label>
							<select
								name="executors"
								value={formData.executors[0]}
								onChange={(e) => {
									setFormData(prev => ({
										...prev,
										executors: [Number(e.target.value)]
									}))
								}}
								className="w-full border border-gray-300 rounded-md px-3 py-2"
								required
							>
								<option value={userid}>Текущий пользователь</option>
							</select>
						</div>

						<div>
							<label className="flex items-center">
								<input
									type="checkbox"
									name="is_completed"
									checked={formData.is_completed}
									onChange={handleInputChange}
									className="mr-2"
								/>
								<span className="text-sm text-gray-700">Выполнено</span>
							</label>
						</div>
					</div>

					{error && (
						<div className="mt-4 text-red-500 text-sm">{error}</div>
					)}

					<div className="flex justify-end space-x-2 mt-6">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
							disabled={isSubmitting}
						>
							Отмена
						</button>

						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded-md"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Сохранение..." : "Сохранить"}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default TodoModal