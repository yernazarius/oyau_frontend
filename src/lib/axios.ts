import axios from 'axios'
import { isAuthenticated } from './auth'

const baseURL = 'https://api.oyau.kz'

const axiosInstance = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
	// Enable sending and receiving cookies
	withCredentials: true
})

// No need for request interceptor to add Authorization header
// since the authentication is handled via cookies automatically

axiosInstance.interceptors.response.use(
	(response) => {
		return response
	},
	async (error) => {
		const originalRequest = error.config

		// If request fails with 401 Unauthorized and hasn't been retried yet
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				// Try refreshing the token via the refresh endpoint
				// The FastAPI backend should handle the cookie refresh automatically
				await axios.post(
					`${baseURL}/api/auth/jwt/refresh`,
					{},
					{
						withCredentials: true // Important for cookie handling
					}
				)

				// If refresh was successful, retry the original request
				// The new cookie should be set automatically
				return axiosInstance(originalRequest)
			} catch (err) {
				console.error('Failed to refresh authentication:', err)

				// If refresh fails, redirect to login
				window.location.href = '/login'
				return Promise.reject(error)
			}
		}

		return Promise.reject(error)
	}
)

export default axiosInstance