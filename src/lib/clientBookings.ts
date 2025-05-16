import axiosInstance from './axios'
import { ClientVisit } from '@/components/Client/ClientCard'
import { BookingRead } from './booking'

/**
 * Fetches booking history for a specific client
 * @param clientId The client ID
 * @returns Promise with array of client visits
 */
export const getClientBookingHistory = async (clientId: number): Promise<ClientVisit[]> => {
	try {
		// You might need to adjust this endpoint based on your actual API
		const response = await axiosInstance.get('/api/booking/bookings')
		const bookings: BookingRead[] = response.data

		// Filter bookings for this client
		const clientBookings = bookings.filter(booking => booking.client_id === clientId)

		// Format bookings as client visits
		return clientBookings.map(booking => {
			// Format the date - backend might return in a different format
			const date = booking.date ? new Date(booking.date).toISOString().split('T')[0] :
				new Date().toISOString().split('T')[0] // Fallback to today if no date

			return {
				id: booking.id.toString(),
				date,
				service: 'Услуга', // Replace with actual service from your data model if available
				amount: booking.price || 0
			}
		})
	} catch (error) {
		console.error('Error fetching client booking history:', error)
		return []
	}
}

/**
 * Update the client object with recent visit history
 * @param client The client object
 * @returns Promise with updated client including visits
 */
export const enrichClientWithVisitHistory = async (
	client: { id: string, visits: ClientVisit[] }
): Promise<{ id: string, visits: ClientVisit[] }> => {
	try {
		const clientId = parseInt(client.id)
		if (isNaN(clientId)) return client

		const visitHistory = await getClientBookingHistory(clientId)

		// Return client with updated visit history
		return {
			...client,
			visits: visitHistory
		}
	} catch (error) {
		console.error('Error enriching client with visit history:', error)
		return client
	}
}