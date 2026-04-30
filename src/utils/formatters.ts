import type { UnitSystem } from '../types/weather'

// Locked decision: show integers only — "18°C", never "18.47°C"
export function formatTemperature(value: number, unit: UnitSystem): string {
  return `${Math.round(value)}°${unit === 'metric' ? 'C' : 'F'}`
}

// timezone: from Open-Meteo response.timezone (e.g., "America/New_York")
// NEVER use browser timezone for location-specific times
export function formatLocalTime(
  isoString: string,
  timezone: string,
  options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' }
): string {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: timezone }).format(
    new Date(isoString)
  )
}

// index 0 = "Today", 1 = "Tomorrow", 2+ = short weekday name
// Uses noon to avoid DST edge cases at day boundaries
export function formatLocalDay(
  isoDateString: string,
  timezone: string,
  index: number
): string {
  if (index === 0) return 'Today'
  if (index === 1) return 'Tomorrow'
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: timezone,
  }).format(new Date(`${isoDateString}T12:00:00`))
}

// Wind direction degrees → 8-point cardinal
export function degreesToCardinal(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}
