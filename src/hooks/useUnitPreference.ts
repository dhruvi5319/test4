import { useState } from 'react'
import type { UnitSystem } from '../types/weather'

const STORAGE_KEY = 'weatherUnit'
const VALID_UNITS: UnitSystem[] = ['metric', 'imperial']

function readStoredUnit(): UnitSystem {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && VALID_UNITS.includes(stored as UnitSystem)) {
      return stored as UnitSystem
    }
  } catch {
    // localStorage unavailable (private browsing)
  }
  return 'metric'
}

export function useUnitPreference() {
  const [unit, setUnitState] = useState<UnitSystem>(readStoredUnit)

  const setUnit = (newUnit: UnitSystem) => {
    setUnitState(newUnit)
    try {
      localStorage.setItem(STORAGE_KEY, newUnit)
    } catch {
      // localStorage unavailable — toggle works in-session only
    }
  }

  return { unit, setUnit }
}
