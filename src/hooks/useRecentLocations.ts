import { useState } from 'react'
import type { Location } from '../types/location'

const STORAGE_KEY = 'recentLocations'
const MAX_LOCATIONS = 5

function readFromStorage(): Location[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeToStorage(locations: Location[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations))
  } catch {
    // localStorage unavailable
  }
}

export function useRecentLocations() {
  const [locations, setLocations] = useState<Location[]>(readFromStorage)

  const addLocation = (location: Location) => {
    setLocations(prev => {
      // Remove duplicate by name (case-insensitive)
      const filtered = prev.filter(
        l => l.name.toLowerCase() !== location.name.toLowerCase()
      )
      // Prepend and cap at max
      const updated = [location, ...filtered].slice(0, MAX_LOCATIONS)
      writeToStorage(updated)
      return updated
    })
  }

  const clearLocations = () => {
    setLocations([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  return { locations, addLocation, clearLocations }
}
