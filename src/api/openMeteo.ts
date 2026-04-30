import type { OpenMeteoResponse } from '../types/openMeteoRaw'
import type { UnitSystem } from '../types/weather'

const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast'

export async function fetchWeather(
  lat: number,
  lon: number,
  unit: UnitSystem
): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'is_day',
      'visibility',
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','),
    timezone: 'auto',       // NON-NEGOTIABLE — omitting this returns UTC timestamps
    forecast_days: '7',
    ...(unit === 'imperial' && {
      temperature_unit: 'fahrenheit',
      wind_speed_unit: 'mph',
    }),
  })

  const res = await fetch(`${FORECAST_BASE}?${params}`)
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`)
  return res.json()
}
