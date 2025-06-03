import apiClient from "./apiClient"

export const authService = {
  // Iniciar sesión
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials)
    return response.data
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await apiClient.post("/auth/logout")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      // Limpiar datos locales siempre
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      localStorage.removeItem("empresaSeleccionada")
    }
  },

  // Verificar token
  verifyToken: async () => {
    const response = await apiClient.get("/auth/verify")
    return response.data
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    const response = await apiClient.post("/auth/change-password", passwordData)
    return response.data
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem("authToken")
    const user = authService.getCurrentUser()
    return !!(token && user)
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem("authToken")
  },

  // Refrescar token
  refreshToken: async () => {
    const response = await apiClient.post("/auth/refresh")
    localStorage.setItem("authToken", response.data.token)
    return response.data
  },
}
