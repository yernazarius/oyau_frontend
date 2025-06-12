import React, { useState } from "react"
import { Todo } from "@/types/todo"
import { updateTodo } from "@/lib/todo"

interface TodoItemProps {
	todo: Todo
	onEditTodo: (todo: Todo) => void
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEditTodo }) => {
	const [isCompleted, setIsCompleted] = useState(todo.is_completed)
	const [isUpdating, setIsUpdating] = useState(false)

	const handleToggleComplete = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation()
		setIsUpdating(true)

		try {
			const updatedTodo = {
				...todo,
				is_completed: !isCompleted
			}

			await updateTodo(todo.id, updatedTodo)
			setIsCompleted(!isCompleted)
		} catch (error) {
			console.error("Failed to update todo:", error)
		} finally {
			setIsUpdating(false)
		}
	}

	const formatDate = (dateString: string) => {
		if (!dateString) return ""

		const date = new Date(dateString)
		return date.toLocaleDateString("ru-RU", {
			day: "2-digit",
			month: "2-digit",
			year: "2-digit"
		})
	}

	return (
		<div
			className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer"
			onClick={() => onEditTodo(todo)}
		>
			<div className="font-medium mb-1">{todo.title}</div>

			<div className="text-sm text-gray-600 mb-1">
				Исполнитель(и): {todo.author?.name || "Имя сотрудника"}
			</div>

			<div className="text-sm text-gray-600 mb-2">
				{todo.client_name || "Имя клиента"}
			</div>

			<div className="flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<span className="inline-block bg-gray-100 p-1 rounded">
						📅 {formatDate(todo.due_date)}
					</span>
					<span className="inline-block bg-gray-100 p-1 rounded">
						⏰ {todo.due_time || "15:00"}
					</span>
				</div>

				<div className="relative">
					<input
						type="checkbox"
						checked={isCompleted}
						onChange={handleToggleComplete}
						className="w-5 h-5 cursor-pointer"
						disabled={isUpdating}
						onClick={(e) => e.stopPropagation()}
					/>
					{isUpdating && (
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default TodoItem