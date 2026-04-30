import { MapPin, Navigation, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { reverseGeocode } from '../api/nominatim'
import { useGeocode } from '../hooks/useGeocode'
import type { Location } from '../types/location'
import type { GeocodingResult } from '../types/openMeteoRaw'

interface LocationBarProps {
  onLocationSelect: (location: Location) => void
  currentLocation: Location | null
}

export default function LocationBar({ onLocationSelect, currentLocation }: LocationBarProps) {
  const [inputValue, setInputValue] = useState(currentLocation?.name ?? '')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [gpsError, setGpsError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: suggestions = [], isLoading: isGeocoding } = useGeocode(inputValue)

  // Open dropdown when suggestions arrive
  useEffect(() => {
    if (suggestions.length > 0 && inputValue.length >= 2) {
      setIsDropdownOpen(true)
    } else {
      setIsDropdownOpen(false)
    }
  }, [suggestions, inputValue])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(result: GeocodingResult) {
    const location: Location = {
      lat: result.latitude,
      lon: result.longitude,
      name: result.name,
      country: result.country_code,
      admin1: result.admin1,
    }
    setInputValue(result.name)
    setIsDropdownOpen(false)
    setHighlightedIndex(-1)
    onLocationSelect(location)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isDropdownOpen || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const targetIndex = highlightedIndex >= 0 ? highlightedIndex : 0
      if (suggestions[targetIndex]) {
        handleSelect(suggestions[targetIndex])
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false)
      setHighlightedIndex(-1)
    }
  }

  function handleClear() {
    setInputValue('')
    setIsDropdownOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  // GPS opt-in — only called on explicit button click, NEVER on mount
  async function handleGpsClick() {
    if (!navigator.geolocation) {
      setGpsError('Geolocation not supported by your browser')
      setGpsStatus('error')
      return
    }
    setGpsStatus('loading')
    setGpsError(null)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const name = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          const location: Location = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            name,
          }
          setInputValue(name)
          setGpsStatus('idle')
          onLocationSelect(location)
        } catch {
          setGpsError('Unable to determine city name — search for a city above')
          setGpsStatus('error')
        }
      },
      (err) => {
        setGpsStatus('error')
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setGpsError('Location access denied — search for a city above')
            break
          case err.POSITION_UNAVAILABLE:
            setGpsError('Unable to detect location — search for a city above')
            break
          case err.TIMEOUT:
            setGpsError('Location timed out — search for a city above')
            break
          default:
            setGpsError('Unable to detect location — search for a city above')
        }
      },
      { timeout: 10000 }
    )
  }

  const showDropdown = isDropdownOpen && suggestions.length > 0

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <MapPin size={18} aria-hidden="true" />
          </div>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            aria-controls="geocode-listbox"
            aria-label="Search for a city"
            placeholder="Search for a city..."
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value)
              setHighlightedIndex(-1)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0 && inputValue.length >= 2) {
                setIsDropdownOpen(true)
              }
            }}
            className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {inputValue && (
            <button
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X size={16} />
            </button>
          )}
          {isGeocoding && !inputValue && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* GPS button */}
        <button
          onClick={handleGpsClick}
          disabled={gpsStatus === 'loading'}
          aria-label="Use my location"
          className="min-w-[48px] min-h-[48px] flex items-center justify-center bg-slate-800 border border-slate-600 rounded-xl text-slate-300 hover:text-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {gpsStatus === 'loading' ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation size={18} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          id="geocode-listbox"
          role="listbox"
          aria-label="City suggestions"
          className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-lg overflow-hidden"
        >
          {suggestions.map((result, index) => (
            <button
              key={result.id}
              role="option"
              aria-selected={index === highlightedIndex}
              onClick={() => handleSelect(result)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors min-h-[44px] flex items-center ${
                index === highlightedIndex
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              <span className="font-medium">{result.name}</span>
              {result.admin1 && (
                <span className="ml-1 text-slate-400">{result.admin1},</span>
              )}
              <span className="ml-1 text-slate-400">{result.country_code}</span>
            </button>
          ))}
        </div>
      )}

      {/* GPS error message */}
      {gpsStatus === 'error' && gpsError && (
        <p role="alert" className="mt-2 text-sm text-amber-400">
          {gpsError}
        </p>
      )}
    </div>
  )
}
