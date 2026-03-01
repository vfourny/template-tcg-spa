import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useApi } from '../composables/useApi.js'
import type { Deck } from '../types/index.js'

export const useDeckStore = defineStore('deck', () => {
  const api = useApi()
  const decks = ref<Deck[]>([])
  const currentDeck = ref<Deck | null>(null)

  const fetchDecks = async (): Promise<void> => {
    decks.value = await api.getMyDecks()
  }

  const fetchDeck = async (id: string | number): Promise<void> => {
    currentDeck.value = await api.getDeck(id)
  }

  const createDeck = async (name: string, cardIds: number[]): Promise<Deck> => {
    const deck = await api.createDeck({ name, cards: cardIds })
    decks.value.push(deck)
    return deck
  }

  const updateDeck = async (
    id: string | number,
    name: string,
    cardIds: number[],
  ): Promise<Deck> => {
    const updated = await api.updateDeck(id, { name, cards: cardIds })
    const index = decks.value.findIndex((d) => d.id === Number(id))
    if (index !== -1) decks.value[index] = updated
    currentDeck.value = updated
    return updated
  }

  const deleteDeck = async (id: string | number): Promise<void> => {
    await api.deleteDeck(id)
    decks.value = decks.value.filter((d) => d.id !== Number(id))
  }

  return {
    decks,
    currentDeck,
    fetchDecks,
    fetchDeck,
    createDeck,
    updateDeck,
    deleteDeck,
  }
})
