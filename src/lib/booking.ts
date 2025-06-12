import axiosInstance from "./axios"
import { Appointment } from "@/components/types"

// Types from the API
export interface BookingCreate {
  client_id: number
  start_time?: string | null
  end_time?: string | null
  date?: null
  price?: number | null
  status?: string | null
  workspace_id: number
}

export interface BookingUpdate {
  id: number
  client_id?: number | null
  start_time?: string | null
  end_time?: string | null
  date?: null
  price?: number | null
  status?: string | null
  workspace_id?: number | null
}

export interface BookingRead {
  id: number
  client_id: number
  start_time?: string | null
  end_time?: string | null
  date?: null
  price?: number | null
  status?: string | null
  workspace_id: number
  client: {
    id: number
    name: string
    surname: string
    phone?: string | null
    email?: string | null
    birth_date?: string | null
    prefernces?: string | null
    comments?: string | null
    category?: string | null
    personal_discount?: number | null
  }
}

// Convert API booking model to frontend Appointment model
export const bookingToAppointment = (booking: BookingRead): Appointment => {
  const statusMap: { [key: string]: "new" | "confirmed" | "canceled" } = {
    new: "new",
    confirmed: "confirmed",
    canceled: "canceled",
  }

  return {
    id: booking.id.toString(),
    startTime: booking.start_time || "00:00",
    endTime: booking.end_time || "00:00",
    clientName:
      `${booking.client.name} ${booking.client.surname}` ||
      "клиент не зарегист",
    phoneNumber: booking.client.phone || "",
    location: "", // Can be mapped if you have location in bookings
    status: statusMap[booking.status || "new"] || "new",
    comment: booking.client.comments || undefined,
    clientType: booking.client.category === "vip" ? "vip" : "regular",
    dateOfBirth: booking.client.birth_date,
    personalDiscount: booking.client.personal_discount,
    notes: booking.client.prefernces,
  }
}

// Convert frontend Appointment model to API BookingCreate model
export const appointmentToBookingCreate = (
  appointment: Appointment,
  clientId: number,
  workspaceId: number,
): BookingCreate => {
  const statusMap: { [key: string]: string } = {
    new: "new",
    confirmed: "confirmed",
    canceled: "canceled",
  }

  return {
    client_id: clientId,
    start_time: appointment.startTime,
    end_time: appointment.endTime,
    status: statusMap[appointment.status] || "new",
    workspace_id: workspaceId,
    price: 0, // Default price if needed
  }
}

// Convert frontend Appointment model to API BookingUpdate model
export const appointmentToBookingUpdate = (
  appointment: Appointment,
  clientId?: number,
): BookingUpdate => {
  const statusMap: { [key: string]: string } = {
    new: "new",
    confirmed: "confirmed",
    canceled: "canceled",
  }

  return {
    id: parseInt(appointment.id),
    client_id: clientId,
    start_time: appointment.startTime,
    end_time: appointment.endTime,
    status: statusMap[appointment.status] || "new",
  }
}

// API functions
export const createBooking = async (
  booking: BookingCreate,
): Promise<BookingRead> => {
  const response = await axiosInstance.post("/api/booking/bookings", booking)
  return response.data
}

export const updateBooking = async (
  booking: BookingUpdate,
): Promise<BookingRead> => {
  const response = await axiosInstance.put("/api/booking/bookings", booking)
  return response.data
}

export const deleteBooking = async (bookingId: number) => {
  const response = await axiosInstance.delete('/api/booking/bookings?booking_id=' + bookingId)
  return response.data
}

export const getBooking = async (bookingId: number): Promise<BookingRead> => {
  const response = await axiosInstance.get(
    `/api/booking/bookings/${bookingId}`,
  )
  return response.data
}

export const getBookings = async (): Promise<BookingRead[]> => {
  const response = await axiosInstance.get("/api/booking/bookings")
  return response.data
}

export const getBookingsByWorkspace = async (
  workspaceId: number,
): Promise<BookingRead[]> => {
  const response = await axiosInstance.get(
    `/api/booking/bookings/workspace/${workspaceId}`,
  )

  return response.data
}
