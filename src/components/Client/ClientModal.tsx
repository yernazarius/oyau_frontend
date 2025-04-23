import React, { useState, useEffect } from 'react'
import { Client } from './ClientCard'
import Button from '../UI/Button'

interface ClientModalProps {
	isOpen: boolean
	onClose: () => void
	client?: Client
	onSave: (client: Client) => void
}

const ClientModal: React.FC<ClientModalProps> = ({
	isOpen,
	onClose,
	client,
	onSave,
}) => {
	const emptyClient: Client = {
		id: '',
		name: '',
		phoneNumber: '',
		category: 'regular',
		visits: [],
	}

	const [formData, setFormData] = useState<Client>(emptyClient)

	useEffect(() => {
		if (isOpen) {
			if (client) {
				setFormData(client)
			} else {
				setFormData(emptyClient)
			}
		}
	}, [isOpen, client])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		const newClient: Client = {
			...formData,
			id: formData.id || Date.now().toString(),
		}

		onSave(newClient)
		onClose()
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 my-8">
				<div className="flex justify-between items-center p-4 border-b border-gray-200">
					<h2 className="text-lg font-medium">
						{client ? 'Редактировать клиента' : 'Новый клиент'}
					</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-4">
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Имя клиента
						</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
							placeholder="Введите имя клиента"
							required
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Номер телефона
						</label>
						<input
							type="tel"
							name="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
							placeholder="+7 (XXX) XXX-XX-XX"
							required
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Категория клиента
						</label>
						<select
							name="category"
							value={formData.category}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
							required
						>
							<option value="regular">Обычный</option>
							<option value="vip">VIP</option>
						</select>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Дата рождения
						</label>
						<input
							type="date"
							name="dateOfBirth"
							value={formData.dateOfBirth || ''}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Персональная скидка (%)
						</label>
						<input
							type="number"
							name="discount"
							value={formData.discount || ''}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
							min="0"
							max="100"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Примечания
						</label>
						<textarea
							name="notes"
							value={formData.notes || ''}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
							placeholder="Что любит, предпочтения и т.д."
							rows={3}
						/>
					</div>

					<div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
						<Button
							variant="outline"
							onClick={onClose}
						>
							Отмена
						</Button>
						<Button
							type="submit"
							variant="primary"
						>
							{client ? 'Сохранить' : 'Создать'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default ClientModal