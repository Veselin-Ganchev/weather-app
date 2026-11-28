import { useState } from 'react'
import ThemeToggle from '../../../components/ThemeToggle.tsx'
import { DEFAULT_LOCATION } from '../constants.ts'
import useForecast from '../hooks/useForecast.ts'
import {
  formatCurrentDate,
  getHourlyForecast,
} from '../utils/weatherUtils.ts'
import type {
  GeocodingLocation,
  TemperatureUnit,
  WeatherLocation,
} from '../types.ts'
import CurrentWeatherCard from './CurrentWeatherCard.tsx'
import HourlyForecast from './HourlyForecast.tsx'
import LocationSearch from './LocationSearch.tsx'
import WeatherDetails from './WeatherDetails.tsx'
import WeeklyForecast from './WeeklyForecast.tsx'
import '../weather.scss'

function WeatherDashboard() {
  const [location, setLocation] = useState<WeatherLocation>(DEFAULT_LOCATION)
  const [unit, setUnit] = useState<TemperatureUnit>('C')
  const { forecast, error, isLoading, retry } = useForecast(location)
  const current = forecast?.current
  const hourlyForecast = getHourlyForecast(forecast)
  const dateLabel = current ? formatCurrentDate(current.time) : ''

  function selectLocation(place: GeocodingLocation) {
    setLocation({
      id: `${place.latitude}-${place.longitude}`,
      name: place.name,
      country: place.country,
      admin1: place.admin1,
      latitude: place.latitude,
      longitude: place.longitude,
    })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a aria-label="Daylight home" className="brand" href="/">
          <span aria-hidden="true" className="brand-mark">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
            </svg>
          </span>
          <span>daylight<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="today-label">{dateLabel || 'Your daily forecast'}</span>
          <ThemeToggle />
          <LocationSearch onSelectLocation={selectLocation} />
        </div>
      </header>

      <main>
        <CurrentWeatherCard
          current={current}
          dateLabel={dateLabel}
          error={error}
          isLoading={isLoading}
          location={location}
          onRetry={retry}
          unit={unit}
        />
        <WeatherDetails
          current={current}
          precipitationChance={hourlyForecast[0]?.precipitation ?? 0}
        />
        <HourlyForecast
          hours={hourlyForecast}
          isDay={Boolean(current?.is_day)}
          unit={unit}
          onUnitChange={setUnit}
        />
        <WeeklyForecast daily={forecast?.daily} unit={unit} />
      </main>

      <footer className="app-footer">
        <span>Made for brighter days <span aria-hidden="true">✳</span></span>
        <span>
          Weather data by{' '}
          <a href="https://open-meteo.com/" rel="noreferrer" target="_blank">
            Open-Meteo
          </a>
        </span>
      </footer>
    </div>
  )
}

export default WeatherDashboard
