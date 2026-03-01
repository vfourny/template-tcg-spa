import type { AuthResponse, Card, Deck } from '../types/index.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const request = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = localStorage.getItem('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(
      (data as { message?: string }).message || `Erreur ${res.status}`,
    )
  }

  return res.json() as Promise<T>
}

export function useApi() {
  return {
    // Auth
    signIn: ({ email, password }: { email: string; password: string }) =>
      request<AuthResponse>('/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    signUp: ({
      email,
      password,
      username,
    }: {
      email: string
      password: string
      username: string
    }) =>
      request<AuthResponse>('/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify({ email, password, username }),
      }),

    // Cards
    getCards: () => request<Card[]>('/cards'),

    // Decks
    getMyDecks: () => request<Deck[]>('/decks/mine'),
    getDeck: (id: string | number) => request<Deck>(`/decks/${id}`),
    createDeck: ({ name, cards }: { name: string; cards: number[] }) =>
      request<Deck>('/decks', {
        method: 'POST',
        body: JSON.stringify({ name, cards }),
      }),
    updateDeck: (
      id: string | number,
      { name, cards }: { name: string; cards: number[] },
    ) =>
      request<Deck>(`/decks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, cards }),
      }),
    deleteDeck: (id: string | number) =>
      request<unknown>(`/decks/${id}`, { method: 'DELETE' }),
  }
}
