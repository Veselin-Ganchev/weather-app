import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchForecast } from './forecastApi.ts'
import { searchLocations } from './locationApi.ts'
import { testForecast, testLocation, testPlaces } from '../test/fixtures.ts'

const fetchMock = vi.fn<typeof fetch>()

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchForecast', () => {
  it('requests the selected coordinates and returns a validated forecast', async () => {
    fetchMock.mockResolvedValue(jsonResponse(testForecast))
    const controller = new AbortController()

    await expect(
      fetchForecast(testLocation, { signal: controller.signal }),
    ).resolves.toEqual(testForecast)

    const [url, options] = fetchMock.mock.calls[0] ?? []
    const requestUrl = new URL(String(url))
    expect(requestUrl.searchParams.get('latitude')).toBe('52.52')
    expect(requestUrl.searchParams.get('longitude')).toBe('13.41')
    expect(requestUrl.searchParams.get('forecast_days')).toBe('7')
    expect(options).toEqual({ signal: controller.signal })
  })

  it('rejects incomplete or misaligned forecast data', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        ...testForecast,
        hourly: {
          ...testForecast.hourly,
          temperature_2m: [18],
        },
      }),
    )

    await expect(fetchForecast(testLocation)).rejects.toThrow(
      'The forecast data is incomplete.',
    )
  })

  it('surfaces HTTP failures', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 503))

    await expect(fetchForecast(testLocation)).rejects.toThrow(
      'We couldn’t load the forecast.',
    )
  })
})

describe('searchLocations', () => {
  it('encodes the query and returns validated locations', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ results: testPlaces }))
    const controller = new AbortController()

    await expect(
      searchLocations('New York', { signal: controller.signal }),
    ).resolves.toEqual(testPlaces)

    const [url, options] = fetchMock.mock.calls[0] ?? []
    const requestUrl = new URL(String(url))
    expect(requestUrl.searchParams.get('name')).toBe('New York')
    expect(options).toEqual({ signal: controller.signal })
  })

  it('returns an empty list when the API has no matches', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ results: null }))

    await expect(searchLocations('Nowhere')).resolves.toEqual([])
  })

  it('rejects malformed result items and HTTP failures', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ results: [{ name: 'Unknown' }] }))
    await expect(searchLocations('Invalid')).rejects.toThrow(
      'The location search returned invalid results.',
    )

    fetchMock.mockResolvedValueOnce(jsonResponse({}, 503))
    await expect(searchLocations('Unavailable')).rejects.toThrow(
      'Location search is unavailable.',
    )
  })
})
