import React from 'react'
import { CalendarDayProps } from '../types'
import TimeSlot from './TimeSlot'

const CalendarDay: React.FC<CalendarDayProps> = ({
	date,
	appointments,
	onAppointmentClick,
	onTimeSlotClick,
}) => {
	const hours = Array.from({ length: 24 }, (_, i) => i)

	const formatDate = (date: Date): string => {
		const options: Intl.DateTimeFormatOptions = {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}
		return date.toLocaleDateString('ru-RU', options)
	}

	return (
		<div className="bg-white rounded-lg shadow overflow-hidden">
			<div className="bg-gray-50 p-4 border-b border-gray-200">
				<h3 className="text-lg font-medium text-gray-700">{formatDate(date)}</h3>
				<div className="mt-2 grid grid-cols-3 gap-1 text-xs text-gray-500 font-medium px-16">
					<div className="text-center">Колонка 1</div>
					<div className="text-center">Колонка 2</div>
					<div className="text-center">Колонка 3</div>
				</div>
			</div>

			<div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
				{hours.map((hour) => (
					<TimeSlot
						key={hour}
						hour={hour}
						appointments={appointments}
						onSlotClick={onTimeSlotClick}
						onAppointmentClick={onAppointmentClick}
					/>
				))}
			</div>
		</div>
	)
}

export default CalendarDay