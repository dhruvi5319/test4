import { useState } from 'react'
import CurrentConditions from './components/CurrentConditions'
import DailyForecast from './components/DailyForecast'
import HourlyForecast from './components/HourlyForecast'
import LocationBar from './components/LocationBar'
import SettingsBar from './components/SettingsBar'
import type { Location } from './types/location'

export default function AppShell() {
  const [activeLocation, setActiveLocation] = useState<Location | null>(null)

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="max-w-2xl w-full mx-auto px-4 py-8 space-y-4 flex-1">
        {/* Location search + GPS */}
        <LocationBar
          onLocationSelect={setActiveLocation}
          currentLocation={activeLocation}
        />

        {/* °C / °F toggle */}
        <SettingsBar />

        {/* Weather content */}
        {activeLocation ? (
          <div className="space-y-4">
            <CurrentConditions location={activeLocation} />
            <HourlyForecast lat={activeLocation.lat} lon={activeLocation.lon} />
            <DailyForecast lat={activeLocation.lat} lon={activeLocation.lon} />
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
