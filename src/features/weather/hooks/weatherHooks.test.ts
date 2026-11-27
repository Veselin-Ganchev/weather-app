import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchForecast } from '../api/forecastApi.ts'
import { searchLocations } from '../api/locationApi.ts'
import type { GeocodingLocation } from '../types.ts'
import { testForecast, testLocation, testPlaces } from '../test/fixtures.ts'
import useForecast from './useForecast.ts'
import useLocationSearch from './useLocationSearch.ts'

vi.mock('../api/forecastApi.ts', () => ({
  fetchForecast: vi.fn(),
}))

vi.mock('../api/locationApi.ts', () => ({
  searchLocations: vi.fn(),
}))

const fetchForecastMock = vi.mocked(fetchForecast)
const searchLocationsMock = vi.mocked(searchLocations)

beforeEach(() => {
  fetchForecastMock.mockReset()
  searchLocationsMock.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useForecast', () => {
  it('loads the forecast for the selected location', async () => {
    fetchForecastMock.mockResolvedValue(testForecast)
    const { result } = renderHook(() => useForecast(testLocation))

    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(fetchForecastMock).toHaveBeenCalledWith(
      testLocation,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(result.current.forecast).toEqual(testForecast)
    expect(result.current.error).toBe('')
  })

  it('exposes request errors and retries on demand', async () => {
    fetchForecastMock
      .mockRejectedValueOnce(new Error('Forecast unavailable'))
      .mockResolvedValueOnce(testForecast)
    const { result } = renderHook(() => useForecast(testLocation))

    await waitFor(() =>
      expect(result.current.error).toBe('Forecast unavailable'),
    )
    expect(result.current.isLoading).toBe(false)

    await act(async () => result.current.retry())

    await waitFor(() => expect(result.current.forecast).toEqual(testForecast))
    expect(fetchForecastMock).toHaveBeenCalledTimes(2)
    expect(result.current.error).toBe('')
  })

  it('aborts the request when the hook unmounts', () => {
    let requestSignal: AbortSignal | undefined
    fetchForecastMock.mockImplementation((_location, options = {}) => {
      requestSignal = options.signal
      return new Promise(() => {})
    })

    const { unmount } = renderHook(() => useForecast(testLocation))
    unmount()

    expect(requestSignal?.aborted).toBe(true)
  })
})

describe('useLocationSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('debounces and trims the location query', async () => {
    searchLocationsMock.mockResolvedValue(testPlaces)
    const { result } = renderHook(() => useLocationSearch('  Lisbon  ', true))

    expect(result.current.isSearching).toBe(true)
    expect(searchLocationsMock).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(250)
    })

    expect(searchLocationsMock).toHaveBeenCalledWith(
      'Lisbon',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(result.current.suggestions).toEqual(testPlaces)
    expect(result.current.error).toBe('')
    expect(result.current.isSearching).toBe(false)
  })

  it('does not request short or disabled queries', () => {
    const { result, rerender } = renderHook(
      ({ query, enabled }: { query: string; enabled: boolean }) =>
        useLocationSearch(query, enabled),
      { initialProps: { query: 'L', enabled: true } },
    )

    expect(result.current.isSearching).toBe(false)
    rerender({ query: 'Lisbon', enabled: false })
    expect(result.current.isSearching).toBe(false)
    expect(searchLocationsMock).not.toHaveBeenCalled()
  })

  it('reports an empty result and ignores a response after its query is cancelled', async () => {
    searchLocationsMock.mockResolvedValueOnce([])
    const { result, rerender } = renderHook(
      ({ query }: { query: string }) => useLocationSearch(query, true),
      { initialProps: { query: 'Nowhere' } },
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(250)
    })
    expect(result.current.error).toBe('No matching places found.')

    let resolveSearch: (locations: GeocodingLocation[]) => void = () => {}
    const pendingSearch = new Promise<GeocodingLocation[]>((resolve) => {
      resolveSearch = resolve
    })
    searchLocationsMock.mockReturnValueOnce(pendingSearch)
    rerender({ query: 'Lisbon' })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(250)
    })
    const requestSignal = searchLocationsMock.mock.calls[1]?.[1]?.signal

    rerender({ query: 'Porto' })
    expect(requestSignal?.aborted).toBe(true)

    await act(async () => {
      resolveSearch(testPlaces)
      await pendingSearch
    })
    expect(result.current.suggestions).toEqual([])
    expect(result.current.error).toBe('')
  })
})
