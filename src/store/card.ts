import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useApi } from '../composables/useApi.js'
import type { Card } from '../types/index.js'

export const useCardStore = defineStore('card', () => {
  const api = useApi()
  const cards = ref<Card[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCards = async (): Promise<void> => {
    if (cards.value.length > 0) return
    loading.value = true
    error.value = null
    try {
      cards.value = await api.getCards()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return { cards, loading, error, fetchCards }
})
