import axios from "axios"
import { getToken, logout } from "../stores/auth"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
})

// Add interceptor for request error handling
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add interceptor for response error handling
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error?.response?.status === 401) {
      logout()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default api
