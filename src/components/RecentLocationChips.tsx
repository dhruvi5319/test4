import { MapPin } from 'lucide-react'
import type { Location } from '../types/location'

interface RecentLocationChipsProps {
  locations: Location[]
  onSelect: (location: Location) => void
}

export default function RecentLocationChips({ locations, onSelect }: RecentLocationChipsProps) {
  if (locations.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2" aria-label="Recent locations">
      {locations.map(loc => (
        <button
          key={`${loc.lat},${loc.lon}`}
          onClick={() => onSelect(loc)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-full text-sm text-slate-300 hover:text-white hover:border-blue-500 transition-colors min-h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Load weather for ${loc.name}`}
        >
          <MapPin size={12} aria-hidden="true" />
          <span>{loc.name}</span>
          {loc.country && <span className="text-slate-500">{loc.country}</span>}
        </button>
      ))}
    </div>
  )
}
