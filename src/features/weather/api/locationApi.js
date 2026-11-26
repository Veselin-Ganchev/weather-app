const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export async function searchLocations(query, { signal } = {}) {
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

  const data = await response.json()
  return data.results ?? []
}
