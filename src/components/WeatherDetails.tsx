import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useWeather } from '../hooks/useWeather'
import { useUnitPreference } from '../hooks/useUnitPreference'
import { degreesToCardinal, formatLocalTime } from '../utils/formatters'

function uvLabel(index: number): string {
  if (index <= 2) return 'Low'
  if (index <= 5) return 'Moderate'
  if (index <= 7) return 'High'
  if (index <= 10) return 'Very High'
  return 'Extreme'
}

function uvColor(index: number): string {
  if (index <= 2) return 'text-green-400'
  if (index <= 5) return 'text-yellow-400'
  if (index <= 7) return 'text-orange-400'
  if (index <= 10) return 'text-red-400'
  return 'text-purple-400'
}

interface WeatherDetailsProps {
  lat: number
  lon: number
  timezone: string
}

export default function WeatherDetails({ lat, lon, timezone }: WeatherDetailsProps) {
  const { data, isLoading, isError } = useWeather(lat, lon)
  const { unit } = useUnitPreference()
  const [expanded, setExpanded] = useState(false)

  if (isLoading || isError || !data) return null

  const current = data.current
  const daily = data.daily[0]
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Visibility: Open-Meteo returns metres
  const visibilityDisplay =
    unit === 'metric'
      ? `${(current.visibility / 1000).toFixed(1)} km`
      : `${(current.visibility / 1609.34).toFixed(1)} mi`

  return (
    <div className="rounded-2xl bg-slate-800 overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-controls="weather-details-panel"
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
      >
        <span>Details</span>
        {expanded
          ? <ChevronUp size={16} aria-hidden="true" />
          : <ChevronDown size={16} aria-hidden="true" />
        }
      </button>

      {/* Conditional render (no height animation when prefers-reduced-motion) */}
      {expanded && (
        <div
          id="weather-details-panel"
          className={`px-4 pb-4 grid grid-cols-2 gap-3 ${prefersReducedMotion ? '' : 'animate-in'}`}
        >
          {/* UV Index */}
          {daily && daily.uvIndexMax != null && (
            <div className="space-y-0.5">
              <p className="text-xs text-slate-400">UV Index</p>
              <p className={`text-sm font-medium ${uvColor(daily.uvIndexMax)}`}>
                {Math.round(daily.uvIndexMax)} — {uvLabel(daily.uvIndexMax)}
              </p>
            </div>
          )}

          {/* Wind direction */}
          <div className="space-y-0.5">
            <p className="text-xs text-slate-400">Wind Direction</p>
            <p className="text-sm font-medium text-white">
              {degreesToCardinal(current.windDirection)}
            </p>
          </div>

          {/* Visibility */}
          {current.visibility != null && (
            <div className="space-y-0.5">
              <p className="text-xs text-slate-400">Visibility</p>
              <p className="text-sm font-medium text-white">{visibilityDisplay}</p>
            </div>
          )}

          {/* Sunrise */}
          {daily && daily.sunrise && (
            <div className="space-y-0.5">
              <p className="text-xs text-slate-400">Sunrise</p>
              <p className="text-sm font-medium text-white">
                {formatLocalTime(daily.sunrise, timezone, { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          )}

          {/* Sunset */}
          {daily && daily.sunset && (
            <div className="space-y-0.5">
              <p className="text-xs text-slate-400">Sunset</p>
              <p className="text-sm font-medium text-white">
                {formatLocalTime(daily.sunset, timezone, { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
