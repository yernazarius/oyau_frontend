import axiosInstance from './axios'
import { Client } from '@/components/Client/ClientCard'

// Types from API
export interface ClientCreate {
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

export interface ClientRead {
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

export interface ClientUpdate extends ClientCreate { }

// Convert API client to frontend Client model
export const apiClientToClient = (apiClient: ClientRead): Client => {
	return {
		id: apiClient.id.toString(),
		name: `${apiClient.name} ${apiClient.surname}`,
		phoneNumber: apiClient.phone || '',
		category: apiClient.category === 'vip' ? 'vip' : 'regular',
		dateOfBirth: apiClient.birth_date,
		discount: apiClient.personal_discount,
		notes: apiClient.comments,
		visits: [] // This would need to be populated separately
	}
}

// Convert frontend Client model to API ClientCreate
export const clientToApiClientCreate = (client: Client): ClientCreate => {
	// Split the name into first and last name
	const nameParts = client.name.split(' ')
	const surname = nameParts.length > 1 ? nameParts.pop() || '' : ''
	const name = nameParts.join(' ')

	return {
		name,
		surname,
		phone: client.phoneNumber,
		birth_date: client.dateOfBirth,
		personal_discount: client.discount,
		comments: client.notes,
		category: client.category
	}
}

// Convert frontend Client model to API ClientUpdate
export const clientToApiClientUpdate = (client: Client): ClientUpdate => {
	return clientToApiClientCreate(client)
}

// API functions
export const createClient = async (client: ClientCreate): Promise<ClientRead> => {
	const response = await axiosInstance.post('/api/client/create_client', client)
	return response.data
}

export const updateClient = async (client: ClientUpdate): Promise<ClientRead> => {
	const response = await axiosInstance.put('/api/client/update_client', client)
	return response.data
}

export const deleteClient = async (clientId: number): Promise<void> => {
	await axiosInstance.delete(`/api/client/delete_client?client_id=${clientId}`)
}

export const getClient = async (clientId: number): Promise<ClientRead> => {
	const response = await axiosInstance.get(`/api/client/get_client/${clientId}`)
	return response.data
}

export const getClients = async (): Promise<ClientRead[]> => {
	const response = await axiosInstance.get('/api/client/get_clients')
	return response.data
}

// Helper function to find client by phone number
export const findClientByPhone = async (phone: string): Promise<ClientRead | null> => {
	try {
		const clients = await getClients()
		return clients.find(client => client.phone === phone) || null
	} catch (error) {
		console.error('Error finding client by phone:', error)
		return null
	}
}