const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export async function fetchForecast(location, { signal } = {}) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '7',
  })

  const response = await fetch(`${FORECAST_URL}?${params}`, { signal })
  if (!response.ok) {
    throw new Error('We couldn’t load the forecast. Please try again.')
  }

  const data = await response.json()
  const hasHourlyData =
    Array.isArray(data.hourly?.time) &&
    Array.isArray(data.hourly?.temperature_2m) &&
    data.hourly.time.length > 0 &&
    data.hourly.time.length === data.hourly.temperature_2m.length
  const hasDailyData =
    Array.isArray(data.daily?.time) &&
    Array.isArray(data.daily?.weather_code) &&
    Array.isArray(data.daily?.temperature_2m_min) &&
    Array.isArray(data.daily?.temperature_2m_max) &&
    data.daily.time.length > 0 &&
    data.daily.time.length === data.daily.weather_code.length &&
    data.daily.time.length === data.daily.temperature_2m_min.length &&
    data.daily.time.length === data.daily.temperature_2m_max.length

  if (!data.current || !hasHourlyData || !hasDailyData) {
    throw new Error('The forecast data is incomplete. Please try again.')
  }

  return data
}
