export interface User {
	id: number
	email: string
	is_active: boolean
	is_superuser: boolean
	is_verified: boolean
	name: string
	phone: string
	is_owner: boolean
}

export interface Workspace {
	id: number
	name: string
	location: string
	user_id: number
	bookings: any[]
}

export interface Todo {
	id: number
	title: string
	description: string
	client_name: string
	is_completed: boolean
	due_date: string
	due_time: string
	author_id: number
	workspace_id: number
	created_at: string
	updated_at: string
	author: User
	executors: number[]
	workspace: Workspace
}

export interface CreateTodoPayload {
	title: string
	description: string
	client_name: string
	is_completed: boolean
	due_date: string
	due_time: string
	author_id: number
	workspace_id: number
	executors: number[]
}

export interface UpdateTodoPayload extends CreateTodoPayload {
	id: number
}

export interface ApiError {
	detail: {
		loc: (string | number)[]
		msg: string
		type: string
	}[]
}
