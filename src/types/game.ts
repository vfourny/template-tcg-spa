import type { Card, GameCard } from './card.js'

export interface PlayerBoard {
  activeCard: GameCard | null
  hand: Card[]
  deck: Card[]
  score: 0 | 1 | 2 | 3
}

export interface PlayerSlot {
  board: PlayerBoard
  socketId: string
}

export type GameStatus = 'waiting' | 'playing' | 'finished'

export interface GameState {
  roomId: number
  currentPlayerSocketId: string
  host: PlayerSlot
  guest: PlayerSlot
  status: GameStatus
  winner?: string
}

export interface Room {
  id: number
  hostSocketId: string
}

export interface GameOver {
  winner: string | null
  message: string
}
