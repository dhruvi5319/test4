import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
  Moon,
  Snowflake,
  Sun,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { useWeather } from '../hooks/useWeather'
import { useUnitPreference } from '../hooks/useUnitPreference'
import { getWeatherCondition } from '../utils/weatherCodes'
import { formatTemperature, formatLocalTime } from '../utils/formatters'

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudDrizzle,
  CloudRain, CloudHail, CloudFog, CloudLightning, Snowflake,
}

function WeatherIcon({ name, isDay, size = 24 }: { name: string; isDay: boolean; size?: number }) {
  const iconName = isDay ? name : name.replace('Sun', 'Moon')
  const Icon = ICON_MAP[iconName] ?? ICON_MAP[name] ?? Cloud
  return <Icon size={size} aria-hidden="true" />
}

interface HourlyForecastProps {
  lat: number
  lon: number
}

export default function HourlyForecast({ lat, lon }: HourlyForecastProps) {
  const { data, isLoading, isError } = useWeather(lat, lon)
  const { unit } = useUnitPreference()

  if (isLoading) return <HourlyForecastSkeleton />
  if (isError || !data || data.hourly.length === 0) {
    return <p className="text-slate-400 text-sm">Hourly forecast unavailable</p>
  }

  // Find start index: first hourly entry at or after current API time
  // Use data.current.time (location-timezone ISO string e.g. "2026-04-30T14:00")
  // to avoid UTC vs local-timezone mismatch with new Date().toISOString()
  const currentTimePrefix = data.current.time.slice(0, 13) // "YYYY-MM-DDTHH"
  let startIdx = data.hourly.findIndex(h => h.time.slice(0, 13) >= currentTimePrefix)
  if (startIdx === -1) startIdx = 0

  const cards = data.hourly.slice(startIdx, startIdx + 24)

  return (
    <section aria-label="Hourly forecast">
      <h3 className="text-sm font-medium text-slate-400 mb-3">Next 24 Hours</h3>
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'thin', scrollSnapType: 'x mandatory' }}
      >
        {cards.map((hour, i) => {
          const isFirst = i === 0
          const isDay = hour.isDay === 1
          const condition = getWeatherCondition(hour.weatherCode)
          const iconName = isDay ? condition.iconDay : condition.iconNight
          const time = formatLocalTime(hour.time, data.timezone, { hour: 'numeric' })
          const temp = formatTemperature(hour.temperature, unit)

          return (
            <div
              key={hour.time}
              style={{ scrollSnapAlign: 'start' }}
              className={[
                'flex-shrink-0 flex flex-col items-center justify-between',
                'rounded-xl p-3 min-w-[72px] min-h-[110px]',
                isFirst
                  ? 'bg-blue-600/30 border border-blue-400/50'
                  : 'bg-slate-800 border border-slate-700',
              ].join(' ')}
              aria-label={`${time}: ${condition.label}, ${temp}, ${hour.precipitationProbability}% precipitation`}
            >
              <span className={`text-xs font-medium ${isFirst ? 'text-blue-300' : 'text-slate-400'}`}>
                {time}
              </span>
              <div className="text-white my-1">
                <WeatherIcon name={iconName} isDay={isDay} size={24} />
              </div>
              <span className="text-white text-sm font-semibold">{temp}</span>
              <span className="text-slate-400 text-xs">{hour.precipitationProbability}%</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function HourlyForecastSkeleton() {
  return (
    <section aria-label="Loading hourly forecast">
      <div className="h-4 bg-slate-700 rounded w-28 mb-3 animate-pulse" />
      <div className="flex gap-3 overflow-x-auto pb-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[72px] h-[110px] bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    </section>
  )
}
