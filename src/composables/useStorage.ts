export function useStorage() {
  const get = <T>(key: string): T | null => {
    const item = localStorage.getItem(key)
    if (!item) return null
    try {
      return JSON.parse(item) as T
    } catch {
      return item as unknown as T
    }
  }

  const set = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const remove = (...keys: string[]): void => {
    keys.forEach((key) => localStorage.removeItem(key))
  }

  return { get, set, remove }
}
