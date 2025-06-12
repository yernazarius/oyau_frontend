import React from "react"

interface TodoTabsProps {
	activeFilter: "all" | "executor" | "author"
	onFilterChange: (filter: "all" | "executor" | "author") => void
}

const TodoTabs: React.FC<TodoTabsProps> = ({ activeFilter, onFilterChange }) => {
	return (
		<div className="flex border-b border-gray-200">
			<button
				className={`px-4 py-2 ${activeFilter === "all"
						? "border-b-2 border-blue-500 text-blue-600 font-medium"
						: "text-gray-600"
					}`}
				onClick={() => onFilterChange("all")}
			>
				Текущие
			</button>

			<button
				className={`px-4 py-2 ${activeFilter === "executor"
						? "border-b-2 border-blue-500 text-blue-600 font-medium"
						: "text-gray-600"
					}`}
				onClick={() => onFilterChange("executor")}
			>
				Я - исполнитель
			</button>

			<button
				className={`px-4 py-2 ${activeFilter === "author"
						? "border-b-2 border-blue-500 text-blue-600 font-medium"
						: "text-gray-600"
					}`}
				onClick={() => onFilterChange("author")}
			>
				Я - автор
			</button>
		</div>
	)
}

export default TodoTabs