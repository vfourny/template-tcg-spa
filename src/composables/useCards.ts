import { ref } from 'vue'

import type { Card } from '../types/index.js'
import { useApi } from './useApi.js'

export function useCards() {
  const api = useApi()
  const cards = ref<Card[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCards = async (): Promise<void> => {
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
}
