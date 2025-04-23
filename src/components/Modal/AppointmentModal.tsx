import React, { useState, useEffect } from 'react'
import { AppointmentModalProps, Appointment } from '../types'
import Button from '../UI/Button'

const AppointmentModal: React.FC<AppointmentModalProps> = ({
	isOpen,
	onClose,
	appointment,
	isNewAppointment,
	selectedHour,
	selectedDate,
	onSave,
}) => {
	const emptyAppointment: Appointment = {
		id: '',
		startTime: selectedHour ? `${selectedHour.toString().padStart(2, '0')}:00` : '09:00',
		endTime: selectedHour ? `${(selectedHour + 1).toString().padStart(2, '0')}:00` : '10:00',
		clientName: '',
		phoneNumber: '',
		location: '',
		status: 'new',
	}

	const [formData, setFormData] = useState<Appointment>(emptyAppointment)
	const [showClientDetails, setShowClientDetails] = useState(false)

	useEffect(() => {
		if (isOpen) {
			if (appointment) {
				setFormData(appointment)
			} else {
				setFormData(emptyAppointment)
			}
		}
	}, [isOpen, appointment, selectedHour, selectedDate])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		const newAppointment: Appointment = {
			...formData,
			id: formData.id || Date.now().toString(),
		}

		onSave(newAppointment)
		onClose()
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 my-8">
				<div className="flex justify-between items-center p-4 border-b border-gray-200">
					<h2 className="text-lg font-medium">
						{isNewAppointment ? 'Новая запись' : 'Редактировать запись'}
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
							Клиент
						</label>
						<input
							type="text"
							name="clientName"
							value={formData.clientName}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
							placeholder="Имя клиента"
							required
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Телефон
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

					<div className="grid grid-cols-2 gap-4 mb-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Начало
							</label>
							<input
								type="time"
								name="startTime"
								value={formData.startTime}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Окончание
							</label>
							<input
								type="time"
								name="endTime"
								value={formData.endTime}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded"
								required
							/>
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Место проведения
						</label>
						<input
							type="text"
							name="location"
							value={formData.location}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
							placeholder="Место проведения"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Статус
						</label>
						<select
							name="status"
							value={formData.status}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
							required
						>
							<option value="new">Новое</option>
							<option value="confirmed">Подтверждено</option>
							<option value="canceled">Отменено</option>
						</select>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Комментарий
						</label>
						<textarea
							name="comment"
							value={formData.comment || ''}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
							placeholder="Комментарий"
							rows={3}
						/>
					</div>

					<div className="mb-4">
						<button
							type="button"
							className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
							onClick={() => setShowClientDetails(!showClientDetails)}
						>
							{showClientDetails ? 'Скрыть' : 'Показать'} дополнительную информацию
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className={`ml-1 transform ${showClientDetails ? 'rotate-180' : ''}`}
							>
								<polyline points="6 9 12 15 18 9"></polyline>
							</svg>
						</button>
					</div>

					{showClientDetails && (
						<>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Категория клиента
								</label>
								<select
									name="clientType"
									value={formData.clientType || 'regular'}
									onChange={handleChange}
									className="w-full p-2 border border-gray-300 rounded"
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
									name="personalDiscount"
									value={formData.personalDiscount || ''}
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
						</>
					)}

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
							{isNewAppointment ? 'Создать' : 'Сохранить'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AppointmentModal