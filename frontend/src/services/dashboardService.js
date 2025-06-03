import apiClient from "./apiClient"

export const dashboardService = {
  getDashboard: async (empresaId) => {
    const response = await apiClient.get(`/dashboard/${empresaId}`)
    return response.data
  },

  getVencimientos: async (empresaId, dias = 30) => {
    const response = await apiClient.get(`/dashboard/${empresaId}/vencimientos?dias=${dias}`)
    return response.data
  },

  getIndicadores: async (empresaId) => {
    const response = await apiClient.get(`/dashboard/${empresaId}/indicadores`)
    return response.data
  },
}
