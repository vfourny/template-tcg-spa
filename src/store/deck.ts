import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useApi } from '../composables/useApi.js'
import type { Deck } from '../types/index.js'

export const useDeckStore = defineStore('deck', () => {
  const api = useApi()
  const decks = ref<Deck[]>([])
  const currentDeck = ref<Deck | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDecks = async (): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      decks.value = await api.getMyDecks()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  const fetchDeck = async (id: string | number): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      currentDeck.value = await api.getDeck(id)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  const createDeck = async (name: string, cardIds: number[]): Promise<Deck> => {
    loading.value = true
    error.value = null
    try {
      const deck = await api.createDeck({ name, cards: cardIds })
      decks.value.push(deck)
      return deck
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateDeck = async (
    id: string | number,
    name: string,
    cardIds: number[],
  ): Promise<Deck> => {
    loading.value = true
    error.value = null
    try {
      const updated = await api.updateDeck(id, { name, cards: cardIds })
      const index = decks.value.findIndex((d) => d.id === Number(id))
      if (index !== -1) decks.value[index] = updated
      currentDeck.value = updated
      return updated
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteDeck = async (id: string | number): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      await api.deleteDeck(id)
      decks.value = decks.value.filter((d) => d.id !== Number(id))
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    decks,
    currentDeck,
    loading,
    error,
    fetchDecks,
    fetchDeck,
    createDeck,
    updateDeck,
    deleteDeck,
  }
})
