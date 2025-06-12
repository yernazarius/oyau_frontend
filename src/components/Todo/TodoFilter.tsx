import React, { useState } from "react"

interface FilterOptions {
	authorId?: number
	workspaceId?: number
	startDate?: string
	endDate?: string
	isCompleted?: boolean
}

interface TodoFilterProps {
	onFilterApply: (filters: FilterOptions) => void
	onFilterReset: () => void
	isOpen: boolean
	onClose: () => void
}

const TodoFilter: React.FC<TodoFilterProps> = ({
	onFilterApply,
	onFilterReset,
	isOpen,
	onClose
}) => {
	const [filters, setFilters] = useState<FilterOptions>({})

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target as HTMLInputElement

		if (type === "checkbox") {
			const { checked } = e.target as HTMLInputElement
			setFilters(prev => ({ ...prev, [name]: checked }))
		} else {
			setFilters(prev => ({ ...prev, [name]: value }))
		}
	}

	const handleApplyFilter = () => {
		onFilterApply(filters)
		onClose()
	}

	const handleResetFilter = () => {
		setFilters({})
		onFilterReset()
		onClose()
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-96">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-medium">Фильтр задач</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						✕
					</button>
				</div>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Рабочее пространство
						</label>
						<select
							name="workspaceId"
							value={filters.workspaceId || ""}
							onChange={handleInputChange}
							className="w-full border border-gray-300 rounded-md px-3 py-2"
						>
							<option value="">Все рабочие пространства</option>
							{/* Add workspace options dynamically */}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Автор
						</label>
						<select
							name="authorId"
							value={filters.authorId || ""}
							onChange={handleInputChange}
							className="w-full border border-gray-300 rounded-md px-3 py-2"
						>
							<option value="">Все авторы</option>
							{/* Add author options dynamically */}
						</select>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								С даты
							</label>
							<input
								type="date"
								name="startDate"
								value={filters.startDate || ""}
								onChange={handleInputChange}
								className="w-full border border-gray-300 rounded-md px-3 py-2"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								По дату
							</label>
							<input
								type="date"
								name="endDate"
								value={filters.endDate || ""}
								onChange={handleInputChange}
								className="w-full border border-gray-300 rounded-md px-3 py-2"
							/>
						</div>
					</div>

					<div>
						<label className="flex items-center">
							<input
								type="checkbox"
								name="isCompleted"
								checked={filters.isCompleted || false}
								onChange={handleInputChange}
								className="mr-2"
							/>
							<span className="text-sm text-gray-700">Показывать выполненные</span>
						</label>
					</div>
				</div>

				<div className="flex justify-end space-x-2 mt-6">
					<button
						onClick={handleResetFilter}
						className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
					>
						Сбросить
					</button>

					<button
						onClick={handleApplyFilter}
						className="px-4 py-2 bg-blue-600 text-white rounded-md"
					>
						Применить
					</button>
				</div>
			</div>
		</div>
	)
}

export default TodoFilter