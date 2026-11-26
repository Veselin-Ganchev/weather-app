export interface WeatherLocation {
  id: string
  name: string
  country?: string
  admin1?: string
  latitude: number
  longitude: number
}

export interface GeocodingLocation extends Omit<WeatherLocation, 'id'> {
  id: number
}

export interface CurrentWeather {
  time: string
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: number
  precipitation: number
  weather_code: number
  wind_speed_10m: number
}

export interface HourlyForecastData {
  time: string[]
  temperature_2m: number[]
  precipitation_probability?: number[]
  weather_code?: number[]
}

export interface DailyForecastData {
  time: string[]
  weather_code: number[]
  temperature_2m_min: number[]
  temperature_2m_max: number[]
}

export interface ForecastResponse {
  current: CurrentWeather
  hourly: HourlyForecastData
  daily: DailyForecastData
}

export interface HourlyForecastHour {
  time: string
  temperature: number
  precipitation: number | undefined
  weatherCode: number
}
