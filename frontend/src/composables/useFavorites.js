import { ref } from 'vue'

const STORAGE_KEY = 'predigoal_favorites'

const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
const favorites = ref(new Set(stored))

export function useFavorites() {
  const isFavorite = (id) => favorites.value.has(id)

  const toggleFavorite = (id, event) => {
    event?.stopPropagation()
    event?.preventDefault()
    const next = new Set(favorites.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    favorites.value = next
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
  }

  return { favorites, isFavorite, toggleFavorite }
}
