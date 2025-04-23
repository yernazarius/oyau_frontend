import axiosInstance from './axios'
import Cookies from 'js-cookie'

export interface RegisterData {
	email: string
	password: string
	is_active?: boolean
	is_superuser?: boolean
	is_verified?: boolean
	name: string
	phone?: string
	is_owner?: boolean
}

export interface WorkspaceData {
	name: string
	location: string
	user_id: number
}

// Function to extract user ID from JWT token
const extractUserIdFromToken = (token: string): number | null => {
	try {
		// Split the JWT and decode the payload (second part)
		const base64Payload = token.split('.')[1]
		const payload = JSON.parse(atob(base64Payload))
		return payload.sub ? parseInt(payload.sub) : null
	} catch (e) {
		console.error('Error extracting user ID from token:', e)
		return null
	}
}

// Helper to store user ID
const storeUserId = (userId: number) => {
	localStorage.setItem('userId', userId.toString())
	Cookies.set('userId', userId.toString(), { path: '/' })
}

// Helper to remove tokens and user data
const clearAuthData = () => {
	localStorage.removeItem('userId')
	Cookies.remove('userId', { path: '/' })
}

export const register = async (data: RegisterData): Promise<number | null> => {
	try {
		// Set withCredentials to true to handle cookies
		const response = await axiosInstance.post('/api/auth/register', data, { withCredentials: true })

		// The token is in the cookies, automatically managed by the browser
		// Extract user ID from cookies if possible, or from token in cookies
		const cookies = document.cookie.split(';')
		const authCookie = cookies.find(cookie => cookie.trim().startsWith('fastapiusersauth='))

		if (authCookie) {
			const token = authCookie.split('=')[1]
			const userId = extractUserIdFromToken(token)

			if (userId) {
				storeUserId(userId)
				return userId
			}
		}
		if (response.data && response.data.id) {
			const userId = response.data.id
			storeUserId(userId)
			return userId
		}

		// If we couldn't get user ID from token, try to get it from the URL
		// Some APIs might include it in the response URL or headers
		return null
	} catch (error) {
		console.error('Registration error:', error)
		throw error
	}
}

export const login = async (username: string, password: string) => {
	// Create form data for x-www-form-urlencoded format
	const formData = new URLSearchParams()
	formData.append('grant_type', 'password')
	formData.append('username', username)
	formData.append('password', password)

	try {
		// Set the correct content type for form urlencoded and withCredentials for cookies
		const response = await axiosInstance.post('/api/auth/jwt/login', formData, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			withCredentials: true
		})

		// The token is handled in cookies automatically
		// Try to extract user ID from cookies
		const cookies = document.cookie.split(';')
		const authCookie = cookies.find(cookie => cookie.trim().startsWith('fastapiusersauth='))

		if (authCookie) {
			const token = authCookie.split('=')[1]
			const userId = extractUserIdFromToken(token)

			if (userId) {
				storeUserId(userId)
			}
		}

		return response
	} catch (error) {
		console.error('Login error:', error)
		throw error
	}
}

export const createWorkspace = async (data: WorkspaceData) => {
	return await axiosInstance.post('/api/workspace/workspaces', data, { withCredentials: true })
}

export const logout = () => {
	// Clear stored user data
	clearAuthData()

	// The API might have an endpoint to invalidate the cookie
	axiosInstance.post('/api/auth/logout', {}, { withCredentials: true })
		.catch(error => console.error('Logout error:', error))
		.finally(() => {
			window.location.href = '/login'
		})
}

export const isAuthenticated = () => {
	// Check if the auth cookie exists
	return document.cookie.split(';').some(cookie => cookie.trim().startsWith('fastapiusersauth='))
}

export const getUserId = (): number | null => {
	const userIdStr = localStorage.getItem('userId') || Cookies.get('userId')
	return userIdStr ? parseInt(userIdStr) : null
}