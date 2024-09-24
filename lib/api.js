import axios from 'axios'

export const baseApiUrl = "http://192.168.101.75:8080/api"
// export const baseApiUrl = "https://vipblackbets.ozzo.az/api"

const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    "Accept": 'application/json',
    "Content-Type": "application/json"
  },
  withCredentials: true
})

export default api;