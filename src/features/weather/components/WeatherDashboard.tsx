import { useState } from 'react'
import { DEFAULT_LOCATION } from '../constants.ts'
import useForecast from '../hooks/useForecast.ts'
import {
  formatCurrentDate,
  getHourlyForecast,
} from '../utils/weatherUtils.ts'
import type { GeocodingLocation, WeatherLocation } from '../types.ts'
import CurrentWeatherCard from './CurrentWeatherCard.tsx'
import HourlyForecast from './HourlyForecast.tsx'
import LocationSearch from './LocationSearch.tsx'
import WeatherDetails from './WeatherDetails.tsx'
import WeeklyForecast from './WeeklyForecast.tsx'
import '../weather.css'

function WeatherDashboard() {
  const [location, setLocation] = useState<WeatherLocation>(DEFAULT_LOCATION)
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
            <span />
          </span>
          <span>daylight</span>
        </a>
        <div className="topbar-right">
          <span className="today-label">{dateLabel || 'Your daily forecast'}</span>
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
        />
        <WeatherDetails
          current={current}
          precipitationChance={hourlyForecast[0]?.precipitation ?? 0}
        />
        <HourlyForecast hours={hourlyForecast} isDay={Boolean(current?.is_day)} />
        <WeeklyForecast daily={forecast?.daily} />
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
