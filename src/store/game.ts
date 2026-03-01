import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import { computed, ref } from 'vue'

import router from '../router.js'
import type { GameOver, GameState, PlayerBoard, Room } from '../types/index.js'

export const useGameStore = defineStore('game', () => {
  const socket = ref<Socket | null>(null)
  const socketId = ref<string | null>(null)
  const rooms = ref<Room[]>([])
  const roomId = ref<number | null>(null)
  const gameState = ref<GameState | null>(null)
  const message = ref<string | null>(null)
  const error = ref<string | null>(null)
  const gameOver = ref<GameOver | null>(null)

  const isConnected = computed(() => !!socketId.value)

  const isMyTurn = computed(() => {
    if (!socketId.value || !gameState.value) return false
    return gameState.value.currentPlayerSocketId === socketId.value
  })

  const myRole = computed<'host' | 'guest' | null>(() => {
    if (!socketId.value || !gameState.value) return null
    return gameState.value.host.socketId === socketId.value ? 'host' : 'guest'
  })

  const myBoard = computed<PlayerBoard | null>(() => {
    if (!gameState.value || !myRole.value) return null
    return gameState.value[myRole.value].board
  })

  const opponentBoard = computed<PlayerBoard | null>(() => {
    if (!gameState.value || !myRole.value) return null
    const opponentRole = myRole.value === 'host' ? 'guest' : 'host'
    return gameState.value[opponentRole].board
  })

  const connect = (token: string): void => {
    if (socket.value?.connected) return

    const s = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } })
    socket.value = s

    s.on('connect', () => {
      socketId.value = s.id ?? null
      error.value = null
    })

    s.on('disconnect', () => {
      socketId.value = null
    })

    s.on('connect_error', (err: Error) => {
      error.value = err.message
    })

    s.on('roomCreated', (data: { roomId: number; message: string }) => {
      roomId.value = data.roomId
      message.value = data.message
    })

    s.on('roomsList', (data: Room[]) => {
      rooms.value = data
    })

    s.on('roomsListUpdated', (data: Room[]) => {
      rooms.value = data
    })

    s.on('gameStarted', (data: { gameState: GameState; message: string }) => {
      gameState.value = data.gameState
      roomId.value = data.gameState.roomId
      message.value = data.message
      router.push('/game')
    })

    s.on(
      'gameStateUpdated',
      (data: { gameState: GameState; message: string }) => {
        gameState.value = data.gameState
        message.value = data.message
      },
    )

    s.on('gameEnded', (data: GameOver) => {
      gameOver.value = data
      gameState.value = null
    })

    s.on('opponentDisconnected', (data: { message: string }) => {
      gameOver.value = { winner: null, message: data.message }
      gameState.value = null
    })

    s.on('error', (data: { message: string }) => {
      error.value = data.message
    })
  }

  const disconnect = (): void => {
    socket.value?.disconnect()
    socket.value = null
    socketId.value = null
    rooms.value = []
    roomId.value = null
    gameState.value = null
    message.value = null
    error.value = null
    gameOver.value = null
  }

  const resetGame = (): void => {
    roomId.value = null
    gameState.value = null
    message.value = null
    error.value = null
    gameOver.value = null
  }

  const getRooms = (): void => {
    socket.value?.emit('getRooms')
  }

  const createRoom = (deckId: number): void => {
    error.value = null
    socket.value?.emit('createRoom', { deckId })
  }

  const joinRoom = (rId: number, deckId: number): void => {
    error.value = null
    socket.value?.emit('joinRoom', { roomId: rId, deckId })
  }

  const drawCards = (): void => {
    error.value = null
    socket.value?.emit('drawCards', { roomId: roomId.value })
  }

  const playCard = (cardIndex: number): void => {
    error.value = null
    socket.value?.emit('playCard', { roomId: roomId.value, cardIndex })
  }

  const attack = (): void => {
    error.value = null
    socket.value?.emit('attack', { roomId: roomId.value })
  }

  const endTurn = (): void => {
    error.value = null
    socket.value?.emit('endTurn', { roomId: roomId.value })
  }

  return {
    socketId,
    rooms,
    roomId,
    gameState,
    message,
    error,
    gameOver,
    isConnected,
    isMyTurn,
    myRole,
    myBoard,
    opponentBoard,
    connect,
    disconnect,
    resetGame,
    getRooms,
    createRoom,
    joinRoom,
    drawCards,
    playCard,
    attack,
    endTurn,
  }
})
