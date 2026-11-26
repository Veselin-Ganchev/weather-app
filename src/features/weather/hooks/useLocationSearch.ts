import { useEffect, useState } from 'react'
import { searchLocations } from '../api/locationApi.ts'
import type { GeocodingLocation } from '../types.ts'

function useLocationSearch(query: string, isEnabled: boolean) {
  const [searchState, setSearchState] = useState<{
    query: string
    places: GeocodingLocation[]
    error: string
    isLoading: boolean
  }>({
    query: '',
    places: [],
    error: '',
    isLoading: false,
  })
  const normalizedQuery = query.trim()

  useEffect(() => {
    if (!isEnabled || normalizedQuery.length < 2) return undefined

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setSearchState({
        query: normalizedQuery,
        places: [],
        error: '',
        isLoading: true,
      })

      try {
        const places = await searchLocations(normalizedQuery, {
          signal: controller.signal,
        })

        if (!controller.signal.aborted) {
          setSearchState({
            query: normalizedQuery,
            places,
            error: places.length ? '' : 'No matching places found.',
            isLoading: false,
          })
        }
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setSearchState({
            query: normalizedQuery,
            places: [],
            error:
              requestError instanceof Error
                ? requestError.message
                : 'Location search is unavailable. Please try again.',
            isLoading: false,
          })
        }
      }
    }, 250)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [isEnabled, normalizedQuery])

  const hasCurrentResults = searchState.query === normalizedQuery

  return {
    suggestions: hasCurrentResults ? searchState.places : [],
    error: hasCurrentResults ? searchState.error : '',
    isSearching:
      isEnabled &&
      normalizedQuery.length >= 2 &&
      (!hasCurrentResults || searchState.isLoading),
  }
}

export default useLocationSearch
