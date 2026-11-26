import { getWeatherDescription } from '../utils/weatherUtils.js'
import LocationPinIcon from './LocationPinIcon.jsx'
import WeatherIcon from './WeatherIcon.jsx'

function CurrentWeatherCard({
  location,
  dateLabel,
  current,
  error,
  isLoading,
  onRetry,
}) {
  return (
    <section
      aria-label={`Weather in ${location.name}`}
      className={`weather-hero ${current?.weather_code >= 3 ? 'is-overcast' : ''}`}
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
                <span className="hero-temperature">{Math.round(current.temperature_2m)}°</span>
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
                : getWeatherDescription(current?.weather_code)}
            </p>
            <p className="feels-like">
              Feels like{' '}
              {current ? `${Math.round(current.apparent_temperature)}°` : '—'}
            </p>
          </>
        )}
      </div>

      <div aria-hidden="true" className="hero-art">
        <div className="sun-halo" />
        <div className="sun-disc" />
        <div className="cloud cloud-back" />
        <div className="cloud cloud-front" />
        <div className="hero-hill hill-back" />
        <div className="hero-hill hill-front" />
        <span className="art-sparkle sparkle-one">✳</span>
        <span className="art-sparkle sparkle-two">✳</span>
      </div>
      <div className="hero-footer">
        <span><span className="live-dot" /> Live weather</span>
        <span>Updated just now</span>
      </div>
    </section>
  )
}

export default CurrentWeatherCard
