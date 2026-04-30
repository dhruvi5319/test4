import { useEffect, useState } from 'react'
import CurrentConditions from './components/CurrentConditions'
import DailyForecast from './components/DailyForecast'
import FreshnessIndicator from './components/FreshnessIndicator'
import HourlyForecast from './components/HourlyForecast'
import LocationBar from './components/LocationBar'
import RecentLocationChips from './components/RecentLocationChips'
import SettingsBar from './components/SettingsBar'
import WeatherDetails from './components/WeatherDetails'
import { useRecentLocations } from './hooks/useRecentLocations'
import { useWeather } from './hooks/useWeather'
import type { Location } from './types/location'
import { getWeatherCondition } from './utils/weatherCodes'

function useIsOffline() {
  const [offline, setOffline] = useState(!navigator.onLine)
  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return offline
}

export default function AppShell() {
  const [activeLocation, setActiveLocation] = useState<Location | null>(null)
  const { locations: recentLocations, addLocation } = useRecentLocations()
  const isOffline = useIsOffline()

  function handleLocationSelect(location: Location) {
    setActiveLocation(location)
    addLocation(location)
  }

  // Get weather data for background gradient (cache-deduplicated)
  const { data: weatherData, isError: weatherError } = useWeather(
    activeLocation?.lat ?? null,
    activeLocation?.lon ?? null
  )
  const weatherCode = weatherData?.current.weatherCode ?? null
  const isDay = weatherData?.current.isDay ?? null
  const timezone = weatherData?.timezone ?? ''

  const condition = weatherCode !== null ? getWeatherCondition(weatherCode) : null
  const bgClass = condition
    ? (isDay === 1 ? condition.backgroundClass : condition.backgroundClassNight)
    : null

  return (
    <div
      className={`min-h-screen text-white flex flex-col ${
        bgClass ? `bg-gradient-to-br ${bgClass}` : 'bg-slate-900'
      }`}
    >
      {/* Skip to main content — keyboard/screen reader navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Offline banner */}
      {isOffline && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-amber-600 text-white text-sm text-center py-2 px-4"
        >
          You're offline — showing last known weather
        </div>
      )}

      {/* Network error banner (online but API failed) */}
      {!isOffline && weatherError && activeLocation && !weatherData && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-800/80 text-white text-sm text-center py-2 px-4"
        >
          Unable to load weather — check your connection and try again
        </div>
      )}

      <div id="main-content" className="max-w-2xl w-full mx-auto px-4 py-8 space-y-4 flex-1">
        {/* Location search + GPS */}
        <LocationBar
          onLocationSelect={handleLocationSelect}
          currentLocation={activeLocation}
        />

        {/* Recent location chips */}
        <RecentLocationChips
          locations={recentLocations}
          onSelect={handleLocationSelect}
        />

        {/* °C / °F toggle */}
        <SettingsBar />

        {/* Freshness indicator */}
        <FreshnessIndicator dataUpdatedAt={weatherData?.fetchedAt} />

        {/* Weather content */}
        {activeLocation ? (
          <div className="space-y-4">
            <CurrentConditions location={activeLocation} />
            <HourlyForecast lat={activeLocation.lat} lon={activeLocation.lon} />
            <DailyForecast lat={activeLocation.lat} lon={activeLocation.lon} />
            <WeatherDetails lat={activeLocation.lat} lon={activeLocation.lon} timezone={timezone} />
          </div>
        ) : (
          <div className="text-center text-slate-400 py-20">
            <p className="text-xl font-medium mb-2">Simple Weather</p>
            <p className="text-sm">Search for a city or use your location to get started</p>
          </div>
        )}
      </div>

      {/* Attribution footer — Open-Meteo CC BY 4.0 required */}
      <footer className="text-center text-slate-500 text-xs py-4">
        Weather data from{' '}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-300 transition-colors"
        >
          Open-Meteo
        </a>
        {' '}(CC BY 4.0)
      </footer>
    </div>
  )
}
