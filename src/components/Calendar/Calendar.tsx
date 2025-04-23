import React, { useState } from 'react'
import CalendarHeader from './CalendarHeader'
import CalendarDay from './CalendarDay'
import AppointmentModal from '../Modal/AppointmentModal'
import { Appointment } from '../types'

const Calendar: React.FC = () => {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day')
	const [appointments, setAppointments] = useState<Appointment[]>([
		// Sample appointments to demonstrate multi-hour functionality
		{
			id: '1',
			startTime: '09:00',
			endTime: '10:00',
			clientName: 'Иванов Иван',
			phoneNumber: '+7 777 777 77 77',
			location: 'Кабинет 1',
			status: 'confirmed',
			comment: 'Стандартный прием'
		},
		{
			id: '2',
			startTime: '09:30',
			endTime: '10:30',
			clientName: 'Петрова Анна',
			phoneNumber: '+7 777 111 22 33',
			location: 'Кабинет 2',
			status: 'new',
			comment: 'Новый клиент'
		},
		{
			id: '3',
			startTime: '11:00',
			endTime: '13:30',
			clientName: 'Сидоров Алексей',
			phoneNumber: '+7 777 333 44 55',
			location: 'Кабинет 3',
			status: 'confirmed',
			comment: 'Длительная процедура'
		},
		{
			id: '4',
			startTime: '14:00',
			endTime: '16:00',
			clientName: 'Козлова Ольга',
			phoneNumber: '+7 777 555 66 77',
			location: 'Кабинет 1',
			status: 'confirmed',
			comment: 'VIP клиент'
		}
	])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(undefined)
	const [selectedHour, setSelectedHour] = useState<number | undefined>(undefined)
	const [isNewAppointment, setIsNewAppointment] = useState(true)

	const handlePrevDay = () => {
		const newDate = new Date(currentDate)
		newDate.setDate(currentDate.getDate() - 1)
		setCurrentDate(newDate)
	}

	const handleNextDay = () => {
		const newDate = new Date(currentDate)
		newDate.setDate(currentDate.getDate() + 1)
		setCurrentDate(newDate)
	}

	const handleToday = () => {
		setCurrentDate(new Date())
	}

	const handleViewModeChange = (mode: 'day' | 'week' | 'month') => {
		setViewMode(mode)
	}

	const handleAppointmentClick = (appointment: Appointment) => {
		setSelectedAppointment(appointment)
		setIsNewAppointment(false)
		setIsModalOpen(true)
	}

	const handleTimeSlotClick = (hour: number) => {
		setSelectedHour(hour)
		setSelectedAppointment(undefined)
		setIsNewAppointment(true)
		setIsModalOpen(true)
	}

	const handleSaveAppointment = (appointment: Appointment) => {
		if (isNewAppointment) {
			setAppointments([...appointments, appointment])
		} else {
			setAppointments(
				appointments.map((app) => (app.id === appointment.id ? appointment : app))
			)
		}
	}

	return (
		<div className="h-full flex flex-col">
			<style jsx global>{`
				.scale-102 {
					scale: 1.02;
				}
				
				@keyframes pulse-border {
					0% { border-color: rgba(59, 130, 246, 0.3); }
					50% { border-color: rgba(59, 130, 246, 0.8); }
					100% { border-color: rgba(59, 130, 246, 0.3); }
				}
				
				.pulse-border {
					animation: pulse-border 2s infinite;
				}
				
				/* Styling for multi-hour appointments */
				.multi-hour-appointment {
					position: absolute;
					z-index: 10;
					width: calc(100% - 0.5rem);
				}
				
				/* Fix calendar positions */
				.calendar-grid {
					position: relative;
				}
				
				.time-slot {
					position: relative;
					z-index: 1;
				}
			`}</style>

			<CalendarHeader
				date={currentDate}
				onPrevDay={handlePrevDay}
				onNextDay={handleNextDay}
				onToday={handleToday}
				viewMode={viewMode}
				onViewModeChange={handleViewModeChange}
			/>

			<div className="flex-grow overflow-hidden">
				{viewMode === 'day' && (
					<CalendarDay
						date={currentDate}
						appointments={appointments}
						onAppointmentClick={handleAppointmentClick}
						onTimeSlotClick={handleTimeSlotClick}
					/>
				)}
				{/* Week and Month views would be implemented here */}
			</div>

			<AppointmentModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				appointment={selectedAppointment}
				isNewAppointment={isNewAppointment}
				selectedHour={selectedHour}
				selectedDate={currentDate}
				onSave={handleSaveAppointment}
			/>
		</div>
	)
}

export default Calendar