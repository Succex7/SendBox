import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000,
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('sendbox_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

instance.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sendbox_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance