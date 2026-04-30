export interface Location {
  lat: number
  lon: number
  name: string
  country?: string
  admin1?: string
}

export interface RecentLocation extends Location {
  searchedAt: number // Unix timestamp (ms)
}
