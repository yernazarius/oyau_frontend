import { CreateTodoPayload, Todo, UpdateTodoPayload } from "@/types/todo"

const API_BASE_URL = "http://api.oyau.kz"

export async function fetchTodos(): Promise<Todo[]> {
	const response = await fetch(`${API_BASE_URL}/api/todo/todos`)

	if (!response.ok) {
		throw new Error("Failed to fetch todos")
	}

	return response.json()
}

export async function fetchTodoById(todoId: number): Promise<Todo> {
	const response = await fetch(`${API_BASE_URL}/api/todo/todos/${todoId}`)

	if (!response.ok) {
		throw new Error(`Failed to fetch todo with ID ${todoId}`)
	}

	return response.json()
}

export async function fetchTodosByWorkspace(workspaceId: number): Promise<Todo[]> {
	const response = await fetch(`${API_BASE_URL}/api/todo/todos/workspace/${workspaceId}`)

	if (!response.ok) {
		throw new Error(`Failed to fetch todos for workspace ${workspaceId}`)
	}

	return response.json()
}

export async function fetchTodosByAuthor(authorId: number): Promise<Todo[]> {
	const response = await fetch(`${API_BASE_URL}/api/todo/todos/author/${authorId}`)

	if (!response.ok) {
		throw new Error(`Failed to fetch todos for author ${authorId}`)
	}

	return response.json()
}

export async function createTodo(todoData: CreateTodoPayload): Promise<string> {
	const response = await fetch(`${API_BASE_URL}/api/todo/todos`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(todoData),
	})

	if (!response.ok) {
		const errorData = await response.json()
		throw new Error(errorData.detail?.[0]?.msg || "Failed to create todo")
	}

	return response.json()
}

export async function updateTodo(todoId: number, todoData: UpdateTodoPayload): Promise<string> {
	const response = await fetch(`${API_BASE_URL}/api/todo/todos/${todoId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(todoData),
	})

	if (!response.ok) {
		const errorData = await response.json()
		throw new Error(errorData.detail?.[0]?.msg || `Failed to update todo ${todoId}`)
	}

	return response.json()
}

export async function deleteTodo(todoId: number): Promise<string> {
	const response = await fetch(`${API_BASE_URL}/api/todo/todos?todo_id=${todoId}`, {
		method: "DELETE",
	})

	if (!response.ok) {
		const errorData = await response.json()
		throw new Error(errorData.detail?.[0]?.msg || `Failed to delete todo ${todoId}`)
	}

	return response.json()
}
