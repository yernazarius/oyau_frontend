"use client"

import { useEffect, useState } from "react"
import { fetchTodosByWorkspace } from "@/lib/todo"
import { Todo } from "@/types/todo"
import TodoList from "@/components/Todo/TodoList"
import TodoFilter from "@/components/Todo/TodoFilter"
import TodoTabs from "@/components/Todo/TodoTabs"
import TodoModal from "@/components/Todo/TodoModal"
import { getWorkspaces } from '@/lib/workspace'
import { getUserId } from '@/lib/auth'

export default function TodosPage() {
	const [todos, setTodos] = useState<Todo[]>([])
	const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)
	const [filterType, setFilterType] = useState<"all" | "executor" | "author">("all")
	const [sortType, setSortType] = useState<"manual" | "date" | "priority">("manual")
	const [workspaces, setWorkspaces] = useState<any[]>([])
	const [currentWorkspaceId, setCurrentWorkspaceId] = useState<number | null>(null)
	const [selectedWorkspaceIndex, setSelectedWorkspaceIndex] = useState(0)

	useEffect(() => {
		loadWorkspaces()
	}, [])
	
	useEffect(() => {
		if (currentWorkspaceId) {
			loadTodos()
		}
	}, [currentWorkspaceId])

	useEffect(() => {
		applyFilterAndSort()
	}, [todos, filterType, sortType])
	
	async function loadWorkspaces() {
		try {
			setIsLoading(true)
			setError(null)

			const workspaceData = await getWorkspaces()
			
			if (!workspaceData || workspaceData.length === 0) {
				setError('No workspaces found')
				setIsLoading(false)
				return
			}
			
			setWorkspaces(workspaceData)
			setCurrentWorkspaceId(workspaceData[0]?.id)
		} catch (err) {
			console.error(err)
			setError(err instanceof Error ? err.message : 'Failed to load workspaces')
			setIsLoading(false)
		}
	}

	async function loadTodos() {
		try {
			setIsLoading(true)
			setError(null)

			if (!currentWorkspaceId) {
				setError('No workspace selected')
				setIsLoading(false)
				return
			}

			const todos = await fetchTodosByWorkspace(currentWorkspaceId)
			setTodos(todos)
		} catch (err) {
			console.error(err)
			setError(err instanceof Error ? err.message : 'Failed to load todos')
		} finally {
			setIsLoading(false)
		}
	}

	function applyFilterAndSort() {
		let filtered = [...todos]
		const userID = getUserId() || 1 // Provide fallback value if getUserId returns null

		if (filterType === "executor") {
			filtered = filtered.filter(todo =>
				todo.executors.includes(userID) || todo.author_id === userID
			)
		} else if (filterType === "author") {
			filtered = filtered.filter(todo =>
				todo.author_id === userID
			)
		}

		if (sortType === "date") {
			filtered.sort((a, b) => {
				if (!a.due_date && !b.due_date) return 0
				if (!a.due_date) return 1
				if (!b.due_date) return -1
				return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
			})
		} else if (sortType === "priority") {
			filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0))
		}

		setFilteredTodos(filtered)
	}
	
	const handleWorkspaceChange = (index: number) => {
		setSelectedWorkspaceIndex(index)
		setCurrentWorkspaceId(workspaces[index]?.id || null)
	}

	const handleAddTodo = () => {
		setCurrentTodo(null)
		setIsModalOpen(true)
	}

	const handleEditTodo = (todo: Todo) => {
		setCurrentTodo(todo)
		setIsModalOpen(true)
	}

	const handleFilterChange = (type: "all" | "executor" | "author") => {
		setFilterType(type)
	}

	const handleSortChange = (type: "manual" | "date" | "priority") => {
		setSortType(type)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setCurrentTodo(null)
	}

	const handleSaveTodo = () => {
		loadTodos()
		setIsModalOpen(false)
	}

	const overdueTodos = filteredTodos.filter(todo => {
		if (!todo.due_date || todo.is_completed) return false
		const dueDateTime = todo.due_time
			? new Date(`${todo.due_date} ${todo.due_time}`)
			: new Date(todo.due_date)
		return dueDateTime < new Date()
	})

	const todayTodos = filteredTodos.filter(todo => {
		if (!todo.due_date || todo.is_completed) return false
		const today = new Date()
		const todoDate = new Date(todo.due_date)
		return todoDate.toDateString() === today.toDateString()
	})

	const tomorrowTodos = filteredTodos.filter(todo => {
		if (!todo.due_date || todo.is_completed) return false
		const tomorrow = new Date()
		tomorrow.setDate(tomorrow.getDate() + 1)
		const todoDate = new Date(todo.due_date)
		return todoDate.toDateString() === tomorrow.toDateString()
	})

	const noDateTodos = filteredTodos.filter(todo =>
		!todo.due_date && !todo.is_completed
	)

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Задачи</h1>
			
			{workspaces.length > 0 && (
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Рабочее пространство
					</label>
					<select
						value={selectedWorkspaceIndex}
						onChange={(e) => handleWorkspaceChange(Number(e.target.value))}
						className="w-full md:w-64 border border-gray-300 rounded-md px-3 py-2"
					>
						{workspaces.map((workspace, index) => (
							<option key={workspace.id} value={index}>
								{workspace.name}
							</option>
						))}
					</select>
				</div>
			)}

			<div className="bg-white rounded-lg shadow-sm p-6">
				<div className="flex justify-between mb-6">
					<div className="flex space-x-2">
						<button
							className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg"
							onClick={handleAddTodo}
						>
							<span className="mr-2">+</span>
							Добавить
						</button>
						<button className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-lg">
							<span className="mr-2">✏️</span>
							Править
						</button>
						<button className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg">
							Выполнить
						</button>
						<button className="flex items-center px-4 py-2 bg-red-50 text-red-500 rounded-lg">
							Удалить
						</button>
					</div>

					<button className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-lg">
						<span className="mr-2">🔍</span>
						Фильтр
					</button>
				</div>

				<div className="mb-4">
					<TodoTabs
						activeFilter={filterType}
						onFilterChange={handleFilterChange}
					/>
				</div>

				<div className="flex justify-end mb-4">
					<div className="flex items-center space-x-2">
						<span className="mr-2">Сортировка</span>
						<button
							className={`px-2 py-1 rounded ${sortType === 'manual' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
							onClick={() => handleSortChange("manual")}
						>
							Вручную
						</button>
						<button
							className={`px-2 py-1 rounded ${sortType === 'date' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
							onClick={() => handleSortChange("date")}
						>
							По дате
						</button>
						<button
							className={`px-2 py-1 rounded ${sortType === 'priority' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
							onClick={() => handleSortChange("priority")}
						>
							По приоритету
						</button>
					</div>
				</div>

				{isLoading ? (
					<div className="text-center py-10">Loading...</div>
				) : error ? (
					<div className="text-center py-10 text-red-500">{error}</div>
				) : (
					<div className="grid grid-cols-4 gap-4">
						<div className="border-r border-gray-200 pr-4">
							<h3 className="text-red-500 font-medium mb-4">
								Просроченные — {overdueTodos.length}
							</h3>
							<TodoList todos={overdueTodos} onEditTodo={handleEditTodo} />
						</div>

						<div className="border-r border-gray-200 px-4">
							<h3 className="text-blue-500 font-medium mb-4">
								На сегодня — {todayTodos.length}
							</h3>
							<TodoList todos={todayTodos} onEditTodo={handleEditTodo} />
						</div>

						<div className="border-r border-gray-200 px-4">
							<h3 className="text-green-500 font-medium mb-4">
								На завтра — {tomorrowTodos.length}
							</h3>
							{tomorrowTodos.length > 0 ? (
								<TodoList todos={tomorrowTodos} onEditTodo={handleEditTodo} />
							) : (
								<div className="text-center py-4 text-gray-400">Нет задач</div>
							)}
						</div>

						<div className="pl-4">
							<h3 className="text-gray-500 font-medium mb-4">
								Без срока — {noDateTodos.length}
							</h3>
							<TodoList todos={noDateTodos} onEditTodo={handleEditTodo} />
						</div>
					</div>
				)}
			</div>

			{isModalOpen && (
				<TodoModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					onSave={handleSaveTodo}
					todo={currentTodo}
					userid={getUserId() || 1} // Provide fallback if getUserId returns null
					workspaces={workspaces}
					currentWorkspaceId={currentWorkspaceId}
				/>
			)}
		</div>
	)
}