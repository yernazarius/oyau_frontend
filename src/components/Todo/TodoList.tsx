import React from "react"
import { Todo } from "@/types/todo"
import TodoItem from "./TodoItem"

interface TodoListProps {
	todos: Todo[]
	onEditTodo: (todo: Todo) => void
}

const TodoList: React.FC<TodoListProps> = ({ todos, onEditTodo }) => {
	if (todos.length === 0) {
		return null
	}

	return (
		<div className="space-y-4">
			{todos.map((todo) => (
				<TodoItem
					key={todo.id}
					todo={todo}
					onEditTodo={onEditTodo}
				/>
			))}
		</div>
	)
}

export default TodoList