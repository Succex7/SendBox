import axios from './axiosInstance.js'
export const connectionsAPI = {
  sendRequest: uniqueId => axios.post('/api/connections/request', { uniqueId }),
  respond: (id, status) => axios.patch(`/api/connections/${id}/respond`, { status }),
  getAll: () => axios.get('/api/connections'),
  getPending: () => axios.get('/api/connections/requests'),
}