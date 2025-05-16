import React, { useState, useEffect } from 'react'
import CalendarHeader from './CalendarHeader'
import CalendarDay from './CalendarDay'
import AppointmentModal from '../Modal/AppointmentModal'
import WorkspaceSelector from '../Workspace/WorkspaceSelector'
import { Appointment } from '../types'
import {
	getBookingsByWorkspace,
	bookingToAppointment,
	createBooking,
	updateBooking,
	deleteBooking,
	appointmentToBookingCreate,
	appointmentToBookingUpdate
} from '@/lib/booking'
import { findClientByPhone, createClient } from '@/lib/client'
import { useWorkspace } from '@/contexts/WorkspaceContext'

const Calendar: React.FC = () => {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day')
	const [appointments, setAppointments] = useState<Appointment[]>([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(undefined)
	const [selectedHour, setSelectedHour] = useState<number | undefined>(undefined)
	const [isNewAppointment, setIsNewAppointment] = useState(true)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Use the workspace context
	const { workspace, workspaceId, error: workspaceError } = useWorkspace()

	// Fetch bookings when date or workspace changes
	useEffect(() => {
		if (workspaceId) {
			fetchBookings(workspaceId)
		} else if (workspaceError) {
			setError(workspaceError)
		}
	}, [currentDate, workspaceId, workspaceError])

	const fetchBookings = async (wsId: number) => {
		setLoading(true)
		try {
			const bookings = await getBookingsByWorkspace(wsId)
			// Filter bookings for the current date if needed
			// This depends on how your API handles dates

			// Convert API bookings to frontend appointments
			const newAppointments = bookings.map(booking => bookingToAppointment(booking))
			setAppointments(newAppointments)
		} catch (err) {
			console.error('Error fetching bookings:', err)
			setError('Failed to load appointments. Please try again.')
		} finally {
			setLoading(false)
		}
	}

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

	const handleSaveAppointment = async (appointment: Appointment) => {
		if (!workspaceId) {
			setError('No workspace selected. Please select a workspace first.')
			return
		}

		setLoading(true)
		try {
			// Check if client exists or create a new one
			let clientId: number
			const existingClient = await findClientByPhone(appointment.phoneNumber)

			if (existingClient) {
				clientId = existingClient.id
			} else {
				// Create a new client
				const nameParts = appointment.clientName.split(' ')
				const firstName = nameParts[0] || ''
				const lastName = nameParts.slice(1).join(' ') || ''

				const newClient = await createClient({
					name: firstName,
					surname: lastName,
					phone: appointment.phoneNumber,
					birth_date: appointment.dateOfBirth,
					personal_discount: appointment.personalDiscount,
					comments: appointment.comment,
					category: appointment.clientType
				})

				clientId = newClient.id
			}

			if (isNewAppointment) {
				// Create new booking
				const bookingData = appointmentToBookingCreate(
					appointment,
					clientId,
					workspaceId
				)

				const newBooking = await createBooking(bookingData)
				const newAppointment = bookingToAppointment(newBooking)

				setAppointments([...appointments, newAppointment])
			} else {
				// Update existing booking
				const bookingData = appointmentToBookingUpdate(
					appointment,
					clientId
				)

				const updatedBooking = await updateBooking(bookingData)

				setAppointments(
					appointments.map((app) =>
						(app.id === appointment.id ? bookingToAppointment(updatedBooking) : app)
					)
				)
			}

			setIsModalOpen(false)
		} catch (err) {
			console.error('Error saving appointment:', err)
			setError('Failed to save appointment. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteAppointment = async (appointmentId: string) => {
		if (confirm('Are you sure you want to delete this appointment?')) {
			setLoading(true)
			try {
				await deleteBooking(parseInt(appointmentId))
				setAppointments(appointments.filter(app => app.id !== appointmentId))
				setIsModalOpen(false)
			} catch (err) {
				console.error('Error deleting appointment:', err)
				setError('Failed to delete appointment. Please try again.')
			} finally {
				setLoading(false)
			}
		}
	}

	// If no workspace is selected, show the workspace selector
	if (!workspaceId) {
		return (
			<div className="h-full flex flex-col justify-center items-center">
				<div className="w-full max-w-md">
					<WorkspaceSelector
						onSelect={() => setError(null)}
					/>
				</div>
			</div>
		)
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

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}

			{loading && (
				<div className="flex justify-center items-center py-4">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
				</div>
			)}

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
				onDelete={handleDeleteAppointment}
			/>
		</div>
	)
}

export default Calendar