import type { DeckCard } from './card.js'

export interface Deck {
  id: number
  name: string
  userId: number
  cards: DeckCard[]
}
