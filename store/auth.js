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
      set({user: res.data})
  },
  register: async (formData) => {
      await api.post('/auth/register', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
  },
  logout: async () => {
    await api.post('/auth/logout')
    set({user: null})
  },
}))