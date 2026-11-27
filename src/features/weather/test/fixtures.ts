import type {
  ForecastResponse,
  GeocodingLocation,
  WeatherLocation,
} from '../types.ts'

export const testLocation: WeatherLocation = {
  id: 'berlin',
  name: 'Berlin',
  country: 'Germany',
  latitude: 52.52,
  longitude: 13.41,
}

export const testPlaces: GeocodingLocation[] = [
  {
    id: 2267057,
    name: 'Lisbon',
    country: 'Portugal',
    admin1: 'Lisbon',
    latitude: 38.72,
    longitude: -9.14,
  },
  {
    id: 2267056,
    name: 'Porto',
    country: 'Portugal',
    admin1: 'Porto',
    latitude: 41.15,
    longitude: -8.61,
  },
]

export const testForecast: ForecastResponse = {
  current: {
    time: '2025-01-01T12:00',
    temperature_2m: 18.4,
    relative_humidity_2m: 64,
    apparent_temperature: 17.8,
    is_day: 1,
    precipitation: 0,
    weather_code: 2,
    wind_speed_10m: 12.2,
  },
  hourly: {
    time: [
      '2025-01-01T11:00',
      '2025-01-01T12:00',
      '2025-01-01T13:00',
      '2025-01-01T14:00',
      '2025-01-01T15:00',
      '2025-01-01T16:00',
      '2025-01-01T17:00',
    ],
    temperature_2m: [17, 18.4, 19, 20, 19, 18, 17],
    precipitation_probability: [0, 10, 15, 20, 10, 5, 0],
    weather_code: [3, 2, 1, 0, 2, 3, 3],
  },
  daily: {
    time: ['2025-01-01', '2025-01-02'],
    weather_code: [2, 61],
    temperature_2m_min: [12, 10],
    temperature_2m_max: [20, 17],
  },
}
