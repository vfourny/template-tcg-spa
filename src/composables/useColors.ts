import type { PokemonType } from '../types/index.js'

export const COLORS = {
  success: '#18a058',
  successLight: '#f0fff8',
  warning: '#f0a020',
  error: '#d03050',
  borderHover: '#ccc',
} as const

const TYPE_COLORS: Record<PokemonType, string> = {
  Normal: '#A8A878',
  Fire: '#F08030',
  Water: '#6890F0',
  Electric: '#F8D030',
  Grass: '#78C850',
  Ice: '#98D8D8',
  Fighting: '#C03028',
  Poison: '#A040A0',
  Ground: '#E0C068',
  Flying: '#A890F0',
  Psychic: '#F85888',
  Bug: '#A8B820',
  Rock: '#B8A038',
  Ghost: '#705898',
  Dragon: '#7038F8',
  Dark: '#705848',
  Steel: '#B8B8D0',
  Fairy: '#EE99AC',
}

export function useColors() {
  const hpColor = (percent: number): string => {
    if (percent > 50) return COLORS.success
    if (percent > 25) return COLORS.warning
    return COLORS.error
  }

  const getTypeColor = (type: PokemonType): string => TYPE_COLORS[type]

  return { COLORS, hpColor, getTypeColor }
}
