import type { ForecastResponse, WeatherLocation } from '../types.ts'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number')
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isOptionalNumberArray(value: unknown): value is number[] | undefined {
  return value === undefined || isNumberArray(value)
}

function isForecastResponse(data: unknown): data is ForecastResponse {
  if (!isRecord(data)) return false

  const { current, hourly, daily } = data
  if (!isRecord(current) || !isRecord(hourly) || !isRecord(daily)) return false

  const hasCurrentWeather =
    typeof current.time === 'string' &&
    typeof current.temperature_2m === 'number' &&
    typeof current.relative_humidity_2m === 'number' &&
    typeof current.apparent_temperature === 'number' &&
    typeof current.is_day === 'number' &&
    typeof current.precipitation === 'number' &&
    typeof current.weather_code === 'number' &&
    typeof current.wind_speed_10m === 'number'
  const hasHourlyData =
    isStringArray(hourly.time) &&
    isNumberArray(hourly.temperature_2m) &&
    isOptionalNumberArray(hourly.precipitation_probability) &&
    isOptionalNumberArray(hourly.weather_code) &&
    hourly.time.length > 0 &&
    hourly.time.length === hourly.temperature_2m.length &&
    (hourly.precipitation_probability === undefined ||
      hourly.time.length === hourly.precipitation_probability.length) &&
    (hourly.weather_code === undefined ||
      hourly.time.length === hourly.weather_code.length)
  const hasDailyData =
    isStringArray(daily.time) &&
    isNumberArray(daily.weather_code) &&
    isNumberArray(daily.temperature_2m_min) &&
    isNumberArray(daily.temperature_2m_max) &&
    daily.time.length > 0 &&
    daily.time.length === daily.weather_code.length &&
    daily.time.length === daily.temperature_2m_min.length &&
    daily.time.length === daily.temperature_2m_max.length

  return hasCurrentWeather && hasHourlyData && hasDailyData
}

export async function fetchForecast(
  location: WeatherLocation,
  { signal }: { signal?: AbortSignal } = {},
): Promise<ForecastResponse> {
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

  const data: unknown = await response.json()

  if (!isForecastResponse(data)) {
    throw new Error('The forecast data is incomplete. Please try again.')
  }

  return data
}
