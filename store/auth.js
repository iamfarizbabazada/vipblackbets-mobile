import { create } from "zustand";
import api from '../lib/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  fetchUser: async () => {
      try {
        const res = await api.get('/profile')
        set({user: res.data})
      } catch(err) {
        set({user: null})
        console.error(err)
      }
    },
    login: async (userData) => {
      try {
        const res = await api.post('/auth/login', userData)
        console.log(res.data)
        set({user: res.data})
      } catch(err) {
        throw err
      }
  },
  register: async (userData) => {
        await api.post('/auth/register', {
          user: {
            name: userData.name,
            email: userData.email
          },
          password: userData.password
        })
  },
  verify: async ({email, otp}) => {
    await api.post('/auth/otp/verify', {email, otp})
  },
  resetOtp: async ({email}) => {
    await api.post('/auth/otp/reset', {email})
  },
  logout: async () => {
    await api.post('/auth/logout')
    set({user: null})
  },
  delete: async () => {
    await api.delete('/profile')
    set({user: null})
  }
}))