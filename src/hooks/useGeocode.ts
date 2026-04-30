import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import type { GeocodingResult } from '../types/openMeteoRaw'

async function fetchGeocode(query: string): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json',
  })
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`
  )
  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`)
  const data = await res.json()
  return data.results ?? []
}

export function useGeocode(query: string) {
  const [debouncedQuery] = useDebounce(query, 350)

  return useQuery({
    queryKey: ['geocode', debouncedQuery],
    queryFn: () => fetchGeocode(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}
