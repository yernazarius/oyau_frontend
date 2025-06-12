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
	const [activeWorkspaceId, setActiveWorkspaceId] = useState<number | null>(null)

	// Check localStorage for workspace ID
	useEffect(() => {
		const checkWorkspaceId = () => {
			const storedId = localStorage.getItem("activeWorkspaceId")
			console.log("🔍 Calendar: Checking localStorage, found:", storedId)

			if (storedId) {
				const parsedId = parseInt(storedId)
				if (!isNaN(parsedId)) {
					setActiveWorkspaceId(parsedId)
				}
			} else {
				setActiveWorkspaceId(null)
			}
		}

		// Check immediately
		checkWorkspaceId()

		// Listen for storage changes
		const handleStorageChange = () => {
			checkWorkspaceId()
		}

		window.addEventListener('storage', handleStorageChange)

		// Also check periodically in case storage event doesn't fire
		const interval = setInterval(checkWorkspaceId, 500)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
			clearInterval(interval)
		}
	}, [])

	useEffect(() => {
		if (activeWorkspaceId) {
			console.log("✅ WorkspaceId found, fetching bookings for:", activeWorkspaceId)
			fetchBookings(activeWorkspaceId)
		}
	}, [currentDate, activeWorkspaceId])

	const fetchBookings = async (wsId: number) => {
		setLoading(true)
		try {
			const bookings = await getBookingsByWorkspace(wsId)
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
		if (!activeWorkspaceId) {
			setError('No workspace selected. Please select a workspace first.')
			return
		}

		setLoading(true)
		try {
			let clientId: number
			const existingClient = await findClientByPhone(appointment.phoneNumber)

			if (existingClient) {
				clientId = existingClient.id
			} else {
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
				const bookingData = appointmentToBookingCreate(
					appointment,
					clientId,
					activeWorkspaceId
				)

				const newBooking = await createBooking(bookingData)
				const newAppointment = bookingToAppointment(newBooking)

				setAppointments([...appointments, newAppointment])
			} else {
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

	// const handleDeleteAppointment = async (appointmentId: string) => {
	// 	// if (confirm('Are you sure you want to delete this appointment?')) {
	// 	setLoading(true)
	// 	try {
	// 		await deleteBooking(parseInt(appointmentId))
	// 		setAppointments(appointments.filter(app => app.id !== appointmentId))
	// 		setIsModalOpen(false)
	// 	} catch (err) {
	// 		console.error('Error deleting appointment:', err)
	// 		setError('Failed to delete appointment. Please try again.')
	// 	} finally {
	// 		setLoading(false)
	// 		// }
	// 	}
	// }

	const handleDeleteAppointment = async (appointmentId: string) => {

	setLoading(true);
	try {
		await deleteBooking(parseInt(appointmentId));
		setAppointments(appointments.filter(app => app.id !== appointmentId));
		setIsModalOpen(false);
	} catch (err) {
		console.error('Error deleting appointment:', err);
		setError('Failed to delete appointment. Please try again.');
	} finally {
		setLoading(false);
	}
	}

	const handleWorkspaceSelected = () => {
		// Force re-check of localStorage
		const storedId = localStorage.getItem("activeWorkspaceId")
		if (storedId) {
			const parsedId = parseInt(storedId)
			if (!isNaN(parsedId)) {
				setActiveWorkspaceId(parsedId)
			}
		}
		setError(null)
	}

	console.log("🎯 Calendar render decision - activeWorkspaceId:", activeWorkspaceId)

	if (!activeWorkspaceId) {
		console.log("📝 Showing WorkspaceSelector because activeWorkspaceId is:", activeWorkspaceId)
		return (
			<div className="h-full flex flex-col justify-center items-center">
				<div className="w-full max-w-md">
					<WorkspaceSelector
						onSelect={handleWorkspaceSelected}
					/>
				</div>
			</div>
		)
	}

	console.log("📅 Showing Calendar with activeWorkspaceId:", activeWorkspaceId)

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
				
				.multi-hour-appointment {
					position: absolute;
					z-index: 10;
					width: calc(100% - 0.5rem);
				}
				
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
			</div>

			<AppointmentModal
				workspaceId={activeWorkspaceId}
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