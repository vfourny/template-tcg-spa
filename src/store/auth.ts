import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useApi } from '../composables/useApi.js'
import { useStorage } from '../composables/useStorage.js'
import type { User } from '../types/index.js'

export const useAuthStore = defineStore('auth', () => {
  const api = useApi()
  const storage = useStorage()
  const token = ref<string | null>(storage.get<string>('token'))
  const user = ref<User | null>(storage.get<User>('user'))

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string): Promise<void> => {
    const data = await api.signIn({ email, password })
    token.value = data.token
    user.value = data.user
    storage.set('token', data.token)
    storage.set('user', data.user)
  }

  const register = async (
    email: string,
    password: string,
    username: string,
  ): Promise<void> => {
    const data = await api.signUp({ email, password, username })
    token.value = data.token
    user.value = data.user
    storage.set('token', data.token)
    storage.set('user', data.user)
  }

  const logout = (): void => {
    token.value = null
    user.value = null
    storage.remove('token', 'user')
  }

  return { token, user, isAuthenticated, login, register, logout }
})
