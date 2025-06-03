import apiClient from "./apiClient"

export const empresaService = {
  // Obtener empresas del usuario actual
  getEmpresasUsuario: async () => {
    const response = await apiClient.get("/empresas/usuario")
    return response.data
  },

  // Obtener empresa por ID
  getEmpresa: async (id) => {
    const response = await apiClient.get(`/empresas/${id}`)
    return response.data
  },

  // Crear nueva empresa
  createEmpresa: async (empresaData) => {
    const response = await apiClient.post("/empresas", empresaData)
    return response.data
  },

  // Actualizar empresa
  updateEmpresa: async (id, empresaData) => {
    const response = await apiClient.put(`/empresas/${id}`, empresaData)
    return response.data
  },

  // Eliminar empresa
  deleteEmpresa: async (id) => {
    const response = await apiClient.delete(`/empresas/${id}`)
    return response.data
  },

  // Obtener configuración de empresa
  getConfiguracion: async (empresaId) => {
    const response = await apiClient.get(`/empresas/${empresaId}/configuracion`)
    return response.data
  },

  // Actualizar configuración de empresa
  updateConfiguracion: async (empresaId, configuracion) => {
    const response = await apiClient.put(`/empresas/${empresaId}/configuracion`, configuracion)
    return response.data
  },
}
