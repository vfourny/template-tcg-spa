import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useApi } from '../composables/useApi.js'
import type { User } from '../types/index.js'

export const useAuthStore = defineStore('auth', () => {
  const api = useApi()
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  )

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string): Promise<void> => {
    const data = await api.signIn({ email, password })
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const register = async (
    email: string,
    password: string,
    username: string,
  ): Promise<void> => {
    const data = await api.signUp({ email, password, username })
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const logout = (): void => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, login, register, logout }
})
