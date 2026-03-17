import type { User } from '../types'
 
/**
 * Clé/valeur des données stockées dans le localStorage.
 * Les clés non définies dans cette interface sont autorisées, mais leur type de valeur par défaut est `string | null`.
 */
interface Storage {
  /**
   * Token JWT d'authentification.
   */
  token: string
  /**
   * Informations de l'utilisateur connecté. Contient au minimum un `id` et un `email`, mais peut être étendu avec d'autres propriétés selon les besoins de l'application.
   */
  user: User
}
 
/**
 * Wrapper autour du localStorage pour lire et écrire des données typées.
 */
export function useStorage() {
  /**
   * Lit une valeur depuis le localStorage.
   * Retourne `null` si la clé n'existe pas.
   * @example storage.get('token') // string | null
   * @example storage.get('user') // User | null
   * @example storage.get('customKey') // string | null (par défaut, les clés non définies retournent une string ou null)
   */
  const get = <T extends keyof Storage>(
    key: T | (string & {}),
  ): (keyof Storage extends T ? string : Storage[T]) | null => {
    const item = localStorage.getItem(key)
    if (!item) return null
    try {
      return JSON.parse(item)
    } catch {
      return item as (keyof Storage extends T ? string : Storage[T]) | null
    }
  }
 
  /**
   * Écrit une valeur dans le localStorage (sérialisée en JSON).
   * @example storage.set('token', 'eyJ...')
   * @example storage.set('user', { id: 1, email: '...' })
   * @example storage.set('customKey', { foo: 'bar' }) // les clés non définies sont autorisées, mais leur type de valeur par défaut est unknown
   */
  const set = <T extends keyof Storage>(
    key: T | (string & {}),
    value: keyof Storage extends T ? unknown : Storage[T],
  ) => {
    localStorage.setItem(key, JSON.stringify(value))
  }
 
  /**
   * Supprime une ou plusieurs clés du localStorage.
   * @example storage.remove('token', 'user')
   */
  const remove = (...keys: (keyof Storage | (string & {}))[]) => {
    keys.forEach((key) => localStorage.removeItem(key))
  }
 
  return { get, set, remove }
}
