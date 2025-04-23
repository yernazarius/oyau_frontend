export type AppointmentStatus = 'new' | 'confirmed' | 'canceled'

export interface Appointment {
	id: string
	startTime: string
	endTime: string
	clientName: string
	phoneNumber: string
	location: string
	status: AppointmentStatus
	comment?: string
	clientType?: 'regular' | 'vip'
	dateOfBirth?: string
	personalDiscount?: number
	notes?: string
	visitHistory?: Array<{
		date: string
		service: string
	}>
}

export interface TimeSlotProps {
	hour: number
	appointments: Appointment[]
	onSlotClick: (hour: number) => void
	onAppointmentClick: (appointment: Appointment) => void
}

export interface CalendarDayProps {
	date: Date
	appointments: Appointment[]
	onAppointmentClick: (appointment: Appointment) => void
	onTimeSlotClick: (hour: number) => void
}

export interface CalendarHeaderProps {
	date: Date
	onPrevDay: () => void
	onNextDay: () => void
	onToday: () => void
	viewMode: 'day' | 'week' | 'month'
	onViewModeChange: (mode: 'day' | 'week' | 'month') => void
}

export interface AppointmentItemProps {
	appointment: Appointment
	onClick: (appointment: Appointment) => void
	durationHours?: number
}

export interface AppointmentModalProps {
	isOpen: boolean
	onClose: () => void
	appointment?: Appointment
	isNewAppointment: boolean
	selectedHour?: number
	selectedDate?: Date
	onSave: (appointment: Appointment) => void
}

export interface ButtonProps {
	children: React.ReactNode
	onClick?: () => void
	variant?: 'primary' | 'secondary' | 'outline'
	size?: 'small' | 'medium' | 'large'
	disabled?: boolean
	type?: 'button' | 'submit' | 'reset'
	className?: string
}