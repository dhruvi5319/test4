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
  Wind,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { useWeather } from '../hooks/useWeather'
import { useUnitPreference } from '../hooks/useUnitPreference'
import type { Location } from '../types/location'
import { getWeatherCondition } from '../utils/weatherCodes'
import { formatTemperature, degreesToCardinal } from '../utils/formatters'

// Icon component map
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudDrizzle,
  CloudRain, CloudHail, CloudFog, CloudLightning, Snowflake, Wind,
}

function WeatherIcon({ name, isDay, size = 64 }: { name: string; isDay: boolean; size?: number }) {
  // CloudSun/CloudMoon aren't in lucide-react, fall back gracefully
  const iconName = isDay ? name : name.replace('Sun', 'Moon')
  const Icon = ICON_MAP[iconName] ?? ICON_MAP[name] ?? Cloud
  return <Icon size={size} aria-hidden="true" />
}

interface CurrentConditionsProps {
  location: Location
}

export default function CurrentConditions({ location }: CurrentConditionsProps) {
  const { data, isLoading, isError, refetch } = useWeather(location.lat, location.lon)
  const { unit } = useUnitPreference()

  // aria-live wrapper is ALWAYS in the DOM (FR-11 requirement — conditional render breaks screen reader announcements)
  return (
    <div aria-live="polite" aria-atomic="true">
      {isLoading && <CurrentConditionsSkeleton />}
      {(isError || (!isLoading && !data)) && <WeatherErrorCard onRetry={() => refetch()} />}
      {data && <CurrentConditionsContent location={location} data={data} unit={unit} />}
    </div>
  )
}

function CurrentConditionsContent({ location, data, unit }: {
  location: CurrentConditionsProps['location']
  data: NonNullable<ReturnType<typeof useWeather>['data']>
  unit: ReturnType<typeof useUnitPreference>['unit']
}) {
  const current = data.current
  const daily = data.daily.length > 0 ? data.daily[0] : null
  const condition = getWeatherCondition(current.weatherCode)
  const isDay = current.isDay === 1

  return (
    <div
      className="rounded-2xl p-6 bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm space-y-4"
    >
      {/* Location name */}
      <h2 className="text-lg font-medium text-slate-300">
        {location.name}{location.country ? `, ${location.country}` : ''}
      </h2>

      {/* Hero row: icon + temperature */}
      <div className="flex items-center gap-4">
        <div className="text-white">
          <WeatherIcon name={isDay ? condition.iconDay : condition.iconNight} isDay={isDay} size={72} />
        </div>
        <div>
          <div className="text-7xl font-bold text-white leading-none">
            {formatTemperature(current.temperature, unit)}
          </div>
          <div className="text-slate-300 mt-1">
            {condition.label}
          </div>
        </div>
      </div>

      {/* Feels like */}
      <p className="text-slate-300 text-sm">
        Feels like {formatTemperature(current.feelsLike, unit)}
      </p>

      {/* High / Low */}
      {daily && (
        <p className="text-slate-300 text-sm">
          H: {formatTemperature(daily.tempMax, unit)} &nbsp; L: {formatTemperature(daily.tempMin, unit)}
        </p>
      )}

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-600">
        <div className="text-sm">
          <span className="text-slate-400">Humidity</span>
          <span className="ml-2 text-white font-medium">{current.humidity}%</span>
        </div>
        <div className="text-sm">
          <span className="text-slate-400">Wind</span>
          <span className="ml-2 text-white font-medium">
            {Math.round(current.windSpeed)} {unit === 'metric' ? 'km/h' : 'mph'} {degreesToCardinal(current.windDirection)}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-slate-400">Precip</span>
          <span className="ml-2 text-white font-medium">{current.precipitationProbability}%</span>
        </div>
      </div>
    </div>
  )
}



export function CurrentConditionsSkeleton() {
  return (
    <div className="rounded-2xl p-6 bg-slate-800 space-y-4 animate-pulse" aria-label="Loading weather data">
      <div className="h-5 bg-slate-700 rounded w-32" />
      <div className="flex items-center gap-4">
        <div className="w-18 h-18 bg-slate-700 rounded-full" />
        <div className="space-y-2">
          <div className="h-16 bg-slate-700 rounded w-32" />
          <div className="h-4 bg-slate-700 rounded w-24" />
        </div>
      </div>
      <div className="h-4 bg-slate-700 rounded w-28" />
      <div className="h-4 bg-slate-700 rounded w-24" />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="h-4 bg-slate-700 rounded" />
        <div className="h-4 bg-slate-700 rounded" />
        <div className="h-4 bg-slate-700 rounded" />
      </div>
    </div>
  )
}

export function WeatherErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-2xl p-6 bg-slate-800 border border-red-800 text-center space-y-3"
    >
      <p className="text-slate-300">Unable to load weather. Check your connection and try again.</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Retry
      </button>
    </div>
  )
}
