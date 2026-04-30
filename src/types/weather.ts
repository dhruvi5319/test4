export type UnitSystem = 'metric' | 'imperial'

export interface CurrentWeather {
  time: string  // ISO-8601 in location timezone, e.g. "2026-04-30T14:00"
  temperature: number
  feelsLike: number
  humidity: number
  precipitationProbability: number
  weatherCode: number
  windSpeed: number
  windDirection: number
  isDay: number // 0 or 1 from Open-Meteo
  visibility: number // metres
}

export interface HourlyWeather {
  time: string
  temperature: number
  precipitationProbability: number
  weatherCode: number
  isDay: number
}

export interface DailyWeather {
  date: string
  weatherCode: number
  tempMax: number
  tempMin: number
  precipitationProbabilityMax: number
  sunrise: string
  sunset: string
  uvIndexMax: number
}

export interface WeatherData {
  current: CurrentWeather
  hourly: HourlyWeather[]
  daily: DailyWeather[]
  timezone: string
  fetchedAt: number
  unit: UnitSystem
}
