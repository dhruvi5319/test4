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
import { lazy, Suspense } from 'react'
import { useWeather } from '../hooks/useWeather'
import { useUnitPreference } from '../hooks/useUnitPreference'
import { getWeatherCondition } from '../utils/weatherCodes'
import { formatTemperature, formatLocalDay } from '../utils/formatters'

const TemperatureTrendChart = lazy(() => import('./TemperatureTrendChart'))

function ChartSkeleton() {
  return (
    <div
      className="mt-4 h-[160px] bg-slate-800 rounded-2xl animate-pulse"
      aria-label="Loading temperature chart"
    />
  )
}

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudDrizzle,
  CloudRain, CloudHail, CloudFog, CloudLightning, Snowflake,
}

function WeatherIcon({ name, size = 20 }: { name: string; isDay: boolean; size?: number }) {
  const Icon = ICON_MAP[name] ?? Cloud
  return <Icon size={size} aria-hidden="true" />
}

interface DailyForecastProps {
  lat: number
  lon: number
}

export default function DailyForecast({ lat, lon }: DailyForecastProps) {
  const { data, isLoading, isError } = useWeather(lat, lon)
  const { unit } = useUnitPreference()

  if (isLoading) return <DailyForecastSkeleton />
  if (isError || !data || data.daily.length === 0) {
    return <p className="text-slate-400 text-sm">Daily forecast unavailable</p>
  }

  return (
    <section aria-label="7-day forecast">
      <h3 className="text-sm font-medium text-slate-400 mb-3">7-Day Forecast</h3>
      <div className="rounded-2xl bg-slate-800 divide-y divide-slate-700 overflow-hidden">
        {data.daily.slice(0, 7).map((day, i) => {
          const label = formatLocalDay(day.date, data.timezone, i)
          const condition = getWeatherCondition(day.weatherCode)
          const isToday = i === 0

          return (
            <div
              key={day.date}
              className="flex items-center gap-3 px-4 py-3"
              aria-label={`${label}: ${condition.label}, High ${formatTemperature(day.tempMax, unit)}, Low ${formatTemperature(day.tempMin, unit)}, ${day.precipitationProbabilityMax}% precipitation`}
            >
              {/* Day name */}
              <span className={`w-20 text-sm ${isToday ? 'font-bold text-white' : 'text-slate-300'}`}>
                {label}
              </span>

              {/* Condition icon — always daytime for daily rows (FR-06) */}
              <div className="text-white flex-shrink-0">
                <WeatherIcon name={condition.iconDay} isDay={true} size={20} />
              </div>

              {/* Condition label — hidden on small screens */}
              <span className="flex-1 text-slate-400 text-sm truncate hidden sm:block">
                {condition.label}
              </span>
              <span className="flex-1 sm:hidden" />

              {/* Precipitation */}
              <span className="text-blue-400 text-sm w-10 text-right">
                {day.precipitationProbabilityMax}%
              </span>

              {/* High / Low */}
              <div className="flex gap-2 text-sm w-24 text-right justify-end">
                <span className="text-white font-medium">{formatTemperature(day.tempMax, unit)}</span>
                <span className="text-slate-400">{formatTemperature(day.tempMin, unit)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lazy-loaded temperature trend chart */}
      <Suspense fallback={<ChartSkeleton />}>
        <TemperatureTrendChart data={data.daily.slice(0, 7)} timezone={data.timezone} unit={unit} />
      </Suspense>
    </section>
  )
}

export function DailyForecastSkeleton() {
  return (
    <section aria-label="Loading 7-day forecast">
      <div className="h-4 bg-slate-700 rounded w-24 mb-3 animate-pulse" />
      <div className="rounded-2xl bg-slate-800 divide-y divide-slate-700 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="h-4 bg-slate-700 rounded w-20 animate-pulse" />
            <div className="h-5 w-5 bg-slate-700 rounded animate-pulse" />
            <div className="flex-1 h-4 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 bg-slate-700 rounded w-8 animate-pulse" />
            <div className="h-4 bg-slate-700 rounded w-20 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  )
}
