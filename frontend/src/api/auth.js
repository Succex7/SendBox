import axios from './axiosInstance.js'
export const authAPI = {
  register: d => axios.post('/api/auth/register', d),
  login: d => axios.post('/api/auth/login', d),
  getMe: () => axios.get('/api/auth/me'),
  forgotPassword: email => axios.post('/api/auth/forgot-password', { email }),
  resetPassword: d => axios.post('/api/auth/reset-password', d),
}