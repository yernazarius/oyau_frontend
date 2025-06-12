import axiosInstance from "../lib/axios"

interface RecommendationResponse {
  message: string
}

export const generateGptRecommendation = async (
  clientId: string,
): Promise<RecommendationResponse | string> => {
  try {
    const response = await axiosInstance.get(
      `/api/client/generate_gpt_response/${clientId}`,
    )
    return response.data
  } catch (error) {
    console.error("Error generating GPT recommendation:", error)
    throw error
  }
}
