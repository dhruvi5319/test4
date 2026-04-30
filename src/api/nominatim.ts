export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    format: 'json',
    zoom: '10',
  })
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    { headers: { 'Accept-Language': 'en' } }
  )
  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`)
  const data = await res.json()
  return (
    data.address?.city ??
    data.address?.town ??
    data.address?.village ??
    data.address?.county ??
    `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`
  )
}
