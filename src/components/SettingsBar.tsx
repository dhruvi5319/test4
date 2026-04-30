import { useUnitPreference } from '../hooks/useUnitPreference'

export default function SettingsBar() {
  const { unit, setUnit } = useUnitPreference()

  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-1 bg-slate-800 border border-slate-600 rounded-lg p-1">
        <button
          onClick={() => setUnit('metric')}
          aria-pressed={unit === 'metric'}
          aria-label="Switch to Celsius"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            unit === 'metric'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          °C
        </button>
        <button
          onClick={() => setUnit('imperial')}
          aria-pressed={unit === 'imperial'}
          aria-label="Switch to Fahrenheit"
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            unit === 'imperial'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          °F
        </button>
      </div>
    </div>
  )
}
