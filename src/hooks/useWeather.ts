import { useQuery } from '@tanstack/react-query'
import { fetchWeather } from '../api/openMeteo'
import type { OpenMeteoResponse } from '../types/openMeteoRaw'
import type { WeatherData, CurrentWeather, HourlyWeather, DailyWeather } from '../types/weather'
import { useUnitPreference } from './useUnitPreference'

function mapResponse(raw: OpenMeteoResponse, unit: WeatherData['unit']): WeatherData {
  const current: CurrentWeather = {
    temperature: raw.current.temperature_2m,
    feelsLike: raw.current.apparent_temperature,
    humidity: raw.current.relative_humidity_2m,
    precipitationProbability: raw.current.precipitation_probability,
    weatherCode: raw.current.weather_code,
    windSpeed: raw.current.wind_speed_10m,
    windDirection: raw.current.wind_direction_10m,
    isDay: raw.current.is_day,
    visibility: raw.current.visibility,
  }

  const hourly: HourlyWeather[] = raw.hourly.time.map((time, i) => ({
    time,
    temperature: raw.hourly.temperature_2m[i],
    precipitationProbability: raw.hourly.precipitation_probability[i],
    weatherCode: raw.hourly.weather_code[i],
    isDay: raw.hourly.is_day[i],
  }))

  const daily: DailyWeather[] = raw.daily.time.map((date, i) => ({
    date,
    weatherCode: raw.daily.weather_code[i],
    tempMax: raw.daily.temperature_2m_max[i],
    tempMin: raw.daily.temperature_2m_min[i],
    precipitationProbabilityMax: raw.daily.precipitation_probability_max[i],
    sunrise: raw.daily.sunrise[i],
    sunset: raw.daily.sunset[i],
    uvIndexMax: raw.daily.uv_index_max[i],
  }))

  return {
    current,
    hourly,
    daily,
    timezone: raw.timezone,
    fetchedAt: Date.now(),
    unit,
  }
}

export function useWeather(lat: number | null, lon: number | null) {
  const { unit } = useUnitPreference()

  return useQuery({
    queryKey: ['weather', lat, lon, unit],
    queryFn: async () => {
      const raw = await fetchWeather(lat!, lon!, unit)
      return mapResponse(raw, unit)
    },
    enabled: lat !== null && lon !== null,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  })
}
