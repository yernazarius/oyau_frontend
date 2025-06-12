import axiosInstance from "./axios"

export interface WorkspaceCreate {
  name: string
  location: string
  user_id: number
}

export interface WorkspaceUpdate {
  name: string | null
  location: string | null
  user_id: number | null
}

export interface WorkspaceRead {
  id: number
  name: string
  location: string
  user_id: number
  bookings: any[] | null
}

// API functions
export const createWorkspace = async (
  workspace: WorkspaceCreate,
): Promise<WorkspaceRead> => {
  const response = await axiosInstance.post(
    "/api/workspace/workspaces",
    workspace,
  )
  return response.data
}

export const updateWorkspace = async (
  workspace: WorkspaceUpdate,
): Promise<WorkspaceRead> => {
  const response = await axiosInstance.put(
    "/api/workspace/workspaces",
    workspace,
  )
  return response.data
}

export const deleteWorkspace = async (workspaceId: number): Promise<void> => {
  await axiosInstance.delete(
    `/api/workspace/workspaces?workspace_id=${workspaceId}`,
  )
}

export const getWorkspace = async (
  workspaceId: number,
): Promise<WorkspaceRead> => {
  const response = await axiosInstance.get(
    `/api/workspace/workspaces/${workspaceId}`,
  )
  return response.data
}

export const getWorkspaces = async (): Promise<WorkspaceRead[]> => {
  const response = await axiosInstance.get("/api/workspace/workspaces")
  return response.data
}

export const getWorkspaceByUser = async (
  userId: number,
): Promise<WorkspaceRead> => {
  const response = await axiosInstance.get(
    `/api/workspace/workspaces/${userId}`,
  )
  return response.data
}

// Helper to get current user's active workspace
export const getCurrentWorkspace = async (): Promise<WorkspaceRead | null> => {
  try {
    // Get user ID from localStorage or cookies
    const userIdStr =
      localStorage.getItem("userId") ||
      document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("userId="))
        ?.split("=")[1]

    if (!userIdStr) return null

    const userId = parseInt(userIdStr)
    return await getWorkspaceByUser(userId)
  } catch (error) {
    console.error("Error getting current workspace:", error)
    return null
  }
}


export async function getWorkspaceById(workspaceId: number): Promise<WorkspaceRead> {
  const response = await fetch(`/api/workspaces/${workspaceId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add any auth headers if needed
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch workspace: ${response.statusText}`)
  }

  return response.json()
}