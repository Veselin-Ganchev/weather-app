import { useCallback, useEffect, useState } from 'react'
import { fetchForecast } from '../api/forecastApi.js'

function useForecast(location) {
  const [forecast, setForecast] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadForecast() {
      setIsLoading(true)
      setForecast(null)
      setError('')

      try {
        const data = await fetchForecast(location, { signal: controller.signal })
        setForecast(data)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Something went wrong while loading the forecast.',
          )
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadForecast()
    return () => controller.abort()
  }, [location, reloadKey])

  const retry = useCallback(() => setReloadKey((key) => key + 1), [])

  return { forecast, error, isLoading, retry }
}

export default useForecast
