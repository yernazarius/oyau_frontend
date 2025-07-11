export type AppointmentStatus = "new" | "confirmed" | "canceled"

export interface Appointment {
  id: string
  startTime: string
  endTime: string
  clientName: string
  phoneNumber: string
  location: string
  status: AppointmentStatus
  clientId?: number
  comment?: string
  clientType?: "regular" | "vip"
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
  viewMode: "day" | "week" | "month"
  onViewModeChange: (mode: "day" | "week" | "month") => void
}

export interface AppointmentItemProps {
  appointment: Appointment
  onClick: (appointment: Appointment) => void
  durationHours?: number
}

export interface AppointmentModalProps {
  workspaceId: number
  isOpen: boolean
  onClose: () => void
  appointment?: Appointment
  isNewAppointment: boolean
  selectedHour?: number
  selectedDate?: Date
  onSave: (appointment: Appointment) => void
  onDelete?: (id: string) => void
}

export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  className?: string
}

export interface ApiClient {
  id: string
  name: string
  surname: string
  phone?: string
  category?: string // "vip" or other
  birth_date?: string
  personal_discount?: number | null
  prefernces?: string // Assuming this typo matches your API: prefernces
  comments?: string
}
