import axios from 'axios'

// export const baseUrl = "http://192.168.0.105:8080"

export const baseUrl = "https://vipblackbets.ozzo.az"
export const wssUrl = "wss://vipblackbets.ozzo.az"

export const baseApiUrl = `${baseUrl}/api`



const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    "Accept": 'application/json',
    "Content-Type": "application/json"
  },
  withCredentials: true
})

export default api;