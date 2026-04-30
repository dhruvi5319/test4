import { useState } from 'react'
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



export default function AppShell() {
  const [activeLocation, setActiveLocation] = useState<Location | null>(null)
  const { locations: recentLocations, addLocation } = useRecentLocations()

  function handleLocationSelect(location: Location) {
    setActiveLocation(location)
    addLocation(location)
  }

  // Get weather data for background (deduplicates via TanStack Query cache)
  const { data: weatherData } = useWeather(
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
      <div className="max-w-2xl w-full mx-auto px-4 py-8 space-y-4 flex-1">
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

        {/* Weather content */}
        {activeLocation ? (
          <div className="space-y-4">
            <CurrentConditions location={activeLocation} />
            <FreshnessIndicator dataUpdatedAt={weatherData?.fetchedAt} />
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
