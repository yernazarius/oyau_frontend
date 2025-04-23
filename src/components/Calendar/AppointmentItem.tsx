import React from 'react'
import { AppointmentItemProps } from '../types'

const AppointmentItem: React.FC<AppointmentItemProps> = ({
	appointment,
	onClick,
	durationHours = 1
}) => {
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'confirmed':
				return 'bg-green-100 text-green-800 border-l-4 border-green-500'
			case 'new':
				return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
			case 'canceled':
				return 'bg-red-100 text-red-800 border-l-4 border-red-500'
			default:
				return 'bg-gray-100 text-gray-800 border-l-4 border-gray-500'
		}
	}

	const getStatusText = (status: string) => {
		switch (status) {
			case 'confirmed':
				return 'Подтверждено'
			case 'new':
				return 'Новое'
			case 'canceled':
				return 'Отменено'
			default:
				return status
		}
	}

	// Generate classes for multi-hour appointments
	const getHeightClasses = () => {
		if (durationHours <= 1) return ''
		return 'absolute w-full left-0'
	}

	return (
		<div
			className={`${getStatusColor(appointment.status)} ${getHeightClasses()} p-2 rounded mb-1 cursor-pointer hover:shadow-md hover:scale-102 transition-all duration-200 transform hover:-translate-y-0.5`}
			style={{
				height: durationHours > 1 ? `calc(100% - 0.5rem)` : 'auto',
				overflow: 'hidden'
			}}
			onClick={(e) => {
				e.stopPropagation()
				onClick(appointment)
			}}
		>
			<div className="flex justify-between items-start">
				<div className="text-sm font-medium">
					{appointment.startTime}-{appointment.endTime}
				</div>
				<div className="text-xs font-medium rounded px-2 py-0.5">
					{getStatusText(appointment.status)}
				</div>
			</div>

			<div className="mt-1 text-sm">
				<div>{appointment.clientName}</div>
				<div className="flex items-center text-xs text-gray-600">
					<span>{appointment.phoneNumber}</span>
					{appointment.location && (
						<>
							<span className="mx-1">•</span>
							<span>{appointment.location}</span>
						</>
					)}
				</div>
			</div>

			{appointment.comment && (
				<div className="mt-1 text-xs text-gray-600">
					{appointment.comment}
				</div>
			)}

			<div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-1 rounded-full transition-colors"
					onClick={(e) => {
						e.stopPropagation()
						// Additional action if needed
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="12" cy="12" r="1"></circle>
						<circle cx="19" cy="12" r="1"></circle>
						<circle cx="5" cy="12" r="1"></circle>
					</svg>
				</button>
			</div>

			{durationHours > 1 && (
				<div className="text-xs mt-2 font-medium">
					Длительность: {durationHours} {durationHours === 1 ? 'час' :
						durationHours < 5 ? 'часа' : 'часов'}
				</div>
			)}
		</div>
	)
}

export default AppointmentItem