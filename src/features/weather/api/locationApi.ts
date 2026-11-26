import type { GeocodingLocation } from '../types.ts'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isGeocodingLocation(value: unknown): value is GeocodingLocation {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    (value.country === undefined || typeof value.country === 'string') &&
    (value.admin1 === undefined || typeof value.admin1 === 'string') &&
    typeof value.latitude === 'number' &&
    typeof value.longitude === 'number'
  )
}

export async function searchLocations(
  query: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<GeocodingLocation[]> {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json',
  })

  const response = await fetch(`${GEOCODING_URL}?${params}`, { signal })
  if (!response.ok) {
    throw new Error('Location search is unavailable. Please try again.')
  }

  const data: unknown = await response.json()
  if (!isRecord(data)) {
    throw new Error('The location search returned invalid results. Please try again.')
  }
  if (data.results == null) return []
  if (!Array.isArray(data.results) || !data.results.every(isGeocodingLocation)) {
    throw new Error('The location search returned invalid results. Please try again.')
  }

  return data.results
}
