import axios from './axiosInstance.js'
export const notificationsAPI = {
  getAll: () => axios.get('/api/notifications'),
  markRead: id => axios.patch(`/api/notifications/${id}/read`),
  markAllRead: () => axios.patch('/api/notifications/read-all'),
}