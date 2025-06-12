import React from 'react'
import { TimeSlotProps, Appointment } from '../types'
import AppointmentItem from './AppointmentItem'

const TimeSlot: React.FC<TimeSlotProps> = ({
	hour,
	appointments,
	onSlotClick,
	onAppointmentClick,
}) => {
	const formatHour = (hour: number): string => {
		return `${hour.toString().padStart(2, '0')}:00`
	}

	// Get the hour part from time string (e.g., "09:30" -> 9)
	const getHourFromTimeString = (timeString: string): number => {
		return parseInt(timeString.split(':')[0])
	}

	// Get the minute part from time string (e.g., "09:30" -> 30)
	const getMinuteFromTimeString = (timeString: string): number => {
		return parseInt(timeString.split(':')[1])
	}

	// Calculate duration in hours between start and end times
	const calculateDurationInHours = (startTime: string, endTime: string): number => {
		const startHour = getHourFromTimeString(startTime)
		const startMinute = getMinuteFromTimeString(startTime)
		const endHour = getHourFromTimeString(endTime)
		const endMinute = getMinuteFromTimeString(endTime)

		// Calculate total minutes and convert to hours
		const startTotalMinutes = startHour * 60 + startMinute
		const endTotalMinutes = endHour * 60 + endMinute
		const durationMinutes = endTotalMinutes - startTotalMinutes

		// Round up to handle partial hours
		return Math.max(1, Math.ceil(durationMinutes / 60))
	}

	// Filter appointments that start in this hour
	const appointmentsStartingInThisHour = appointments.filter(
		(appointment) => getHourFromTimeString(appointment.startTime) === hour
	)

	// Calculate how many slots we need to reserve for appointments that span into this hour
	// from previous hours, so we don't place new appointments on top of them
	const slotsOccupiedByPreviousAppointments = () => {
		// Track which columns are occupied by appointments spanning from previous hours
		const occupiedColumns = [false, false, false]

		appointments.forEach(appointment => {
			const startHour = getHourFromTimeString(appointment.startTime)
			const endHour = getHourFromTimeString(appointment.endTime)
			const durationHours = calculateDurationInHours(appointment.startTime, appointment.endTime)

			// If this appointment started before this hour but extends into it
			if (startHour < hour && startHour + durationHours > hour) {
				// Mark a column as occupied - we'll use the same distribution logic
				// to determine which column
				const columnIndex = startHour % 3
				occupiedColumns[columnIndex] = true
			}
		})

		return occupiedColumns
	}

	const distributeAppointments = () => {
		// Get slots already occupied by previous appointments
		const occupiedColumns = slotsOccupiedByPreviousAppointments()

		// Prepare columns for new appointments
		const columns: Array<Array<{
			appointment: Appointment,
			durationHours: number
		}>> = [[], [], []]

		// First, filter out appointments starting in this hour
		appointmentsStartingInThisHour.forEach(appointment => {
			// Try to find an unoccupied column
			let columnIndex = -1
			for (let i = 0; i < 3; i++) {
				if (!occupiedColumns[i]) {
					columnIndex = i
					break
				}
			}

			// If all columns are occupied, just use a modulo distribution
			if (columnIndex === -1) {
				columnIndex = Math.floor(Math.random() * 3)
			}

			const durationHours = calculateDurationInHours(appointment.startTime, appointment.endTime)
			columns[columnIndex].push({ appointment, durationHours })

			// Mark this column as occupied
			occupiedColumns[columnIndex] = true
		})

		return columns
	}

	const appointmentColumns = distributeAppointments()

	return (
		<div className="flex h-24 group time-slot">
			<div className="w-16 py-2 border-r border-gray-200 text-center text-sm text-gray-500 flex-shrink-0">
				{formatHour(hour)}
			</div>
			<div className="flex-grow grid grid-cols-3 gap-3 calendar-grid px-1">
				{appointmentColumns.map((column, columnIndex) => (
					<div
						key={`column-${columnIndex}-hour-${hour}`}
						className="relative p-1 cursor-pointer …"
						onClick={() => onSlotClick(hour)}
					>
						{column.length > 0 ? (
							column.map(({ appointment, durationHours }) => (
								<div
									key={`appt-${appointment.id}-col${columnIndex}-h${hour}`}
									className={`relative ${durationHours > 1 ? 'multi-hour-appointment' : ''}`}
									style={{
										height: durationHours > 1 ? `${durationHours * 6}rem` : 'auto',
										zIndex: durationHours > 1 ? (10 + durationHours) : 'auto'
									}}
								>
									<AppointmentItem
										appointment={appointment}
										onClick={onAppointmentClick}
										durationHours={durationHours}
									/>

								</div>

							))
						) : (
							<div key={`empty-${columnIndex}-h${hour}`}
								className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
										<line x1="12" y1="5" x2="12" y2="19"></line>
										<line x1="5" y1="12" x2="19" y2="12"></line>
									</svg>
								</div>
							</div>
						)}
						<div className="absolute inset-0 border-2 border-transparent hover:border-blue-300 rounded transition-colors duration-200 pointer-events-none"></div>
					</div>
				))}
			</div>
		</div>
	)
}

export default TimeSlot