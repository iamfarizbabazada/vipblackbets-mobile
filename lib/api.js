import axios from 'axios'

export const baseApiUrl = "http://192.168.101.74:8000"

const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    "Accept": 'application/json',
    "Content-Type": "application/x-www-form-urlencoded"
  },
  withCredentials: true
})

export default api;