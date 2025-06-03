import axios from "axios"

// Configuración base del cliente API
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }

    if (error.response?.status === 403) {
      // Sin permisos
      console.error("Sin permisos para realizar esta acción")
    }

    if (error.response?.status >= 500) {
      // Error del servidor
      console.error("Error del servidor:", error.response.data?.message || "Error interno")
    }

    return Promise.reject(error)
  },
)

export default apiClient
