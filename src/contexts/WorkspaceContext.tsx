"use client"
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { getCurrentWorkspace, WorkspaceRead } from '@/lib/workspace'
import { getUserId } from '@/lib/auth'

interface WorkspaceContextType {
	workspace: WorkspaceRead | null
	workspaceId: number | null
	userId: number | null
	loading: boolean
	error: string | null
	refreshWorkspace: () => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextType>({
	workspace: null,
	workspaceId: null,
	userId: null,
	loading: false,
	error: null,
	refreshWorkspace: async () => { }
})

export const useWorkspace = () => useContext(WorkspaceContext)

interface WorkspaceProviderProps {
	children: ReactNode
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({ children }) => {
	const [workspace, setWorkspace] = useState<WorkspaceRead | null>(null)
	const [userId, setUserId] = useState<number | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchWorkspace = async () => {
		setLoading(true)
		setError(null)

		try {
			// Get user ID
			const currentUserId = getUserId()
			setUserId(currentUserId)

			if (!currentUserId) {
				setError('User not authenticated')
				return
			}

			// Get workspace
			const workspaceData = await getCurrentWorkspace()
			setWorkspace(workspaceData)

			if (!workspaceData) {
				setError('No workspace found')
			}
		} catch (err) {
			console.error('Error fetching workspace:', err)
			setError('Failed to load workspace')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchWorkspace()
	}, [])

	const refreshWorkspace = async () => {
		await fetchWorkspace()
	}

	return (
		<WorkspaceContext.Provider
			value={{
				workspace,
				workspaceId: workspace?.id || null,
				userId,
				loading,
				error,
				refreshWorkspace
			}}
		>
			{children}
		</WorkspaceContext.Provider>
	)
}