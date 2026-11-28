import { getWeatherDescription } from '../utils/weatherUtils.ts'
import type {
  CurrentWeather,
  TemperatureUnit,
  WeatherLocation,
} from '../types.ts'
import LocationPinIcon from './LocationPinIcon.tsx'
import WeatherIcon from './WeatherIcon.tsx'
import WeatherLandscape from './WeatherLandscape.tsx'
import { convertTemperature } from '../utils/weatherUtils.ts'

function CurrentWeatherCard({
  location,
  dateLabel,
  current,
  error,
  isLoading,
  onRetry,
  unit = 'C',
}: {
  location: WeatherLocation
  dateLabel: string
  current: CurrentWeather | undefined
  error: string
  isLoading: boolean
  onRetry: () => void
  unit?: TemperatureUnit
}) {
  const temperature = current
    ? convertTemperature(current.temperature_2m, unit)
    : undefined
  const feelsLike = current
    ? convertTemperature(current.apparent_temperature, unit)
    : undefined
  return (
    <section
      aria-label={`Weather in ${location.name}`}
      className={`weather-hero ${(current?.weather_code ?? 0) >= 3 ? 'is-overcast' : ''}`}
    >
      <div className="hero-copy">
        <div className="location-label">
          <LocationPinIcon />
          <span>{[location.name, location.country].filter(Boolean).join(', ')}</span>
        </div>
        <p className="hero-date">{dateLabel || 'Local forecast'}</p>
        {error ? (
          <div className="hero-error" role="alert">
            <p>{error}</p>
            <button onClick={onRetry} type="button">Try again</button>
          </div>
        ) : (
          <>
            <div className="temperature-line">
              {isLoading || !current ? (
                <span aria-label="Loading temperature" className="temperature-skeleton" />
              ) : (
                <span className="hero-temperature">{temperature}°</span>
              )}
              {current && (
                <WeatherIcon
                  className="hero-weather-icon"
                  code={current.weather_code}
                  isDay={Boolean(current.is_day)}
                />
              )}
            </div>
            <p className="hero-condition">
              {isLoading
                ? 'Getting your forecast...'
                : getWeatherDescription(current?.weather_code ?? -1)}
            </p>
            <p className="feels-like">
              Feels like{' '}
              {current ? `${feelsLike}°` : '—'}
            </p>
          </>
        )}
      </div>

      <div aria-hidden="true" className="hero-art">
        <WeatherLandscape />
      </div>
      <div className="hero-footer">
        <span><span className="live-dot" /> Live weather</span>
        <span>Updated just now</span>
      </div>
    </section>
  )
}

export default CurrentWeatherCard
