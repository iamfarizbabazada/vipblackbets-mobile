import { create } from "zustand";
import api from '../lib/api'

export const useAuthStore = create((set) => ({
  user: null,
  fetchUser: async () => {
      const res = await api.get('/profile')
      set({user: res.data})
    },
    login: async (userData) => {
      const res = await api.post('/auth/login', userData)
      console.log(res.data)
      set({user: res.data})
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
}))