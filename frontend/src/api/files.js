import axios from './axiosInstance.js'
export const filesAPI = {
  send: (recipientId, formData, onUploadProgress) =>
    axios.post(`/api/files/send/${recipientId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  getHistory: () => axios.get('/api/files/history'),
  deleteFile: id => axios.delete(`/api/files/${id}`),
}