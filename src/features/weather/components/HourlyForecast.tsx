import { formatHourLabel } from '../utils/weatherUtils.ts'
import type { HourlyForecastHour, TemperatureUnit } from '../types.ts'
import WeatherIcon from './WeatherIcon.tsx'
import TemperatureUnitToggle from '../../../components/TemperatureUnitToggle.tsx'
import { convertTemperature } from '../utils/weatherUtils.ts'

function HourlyForecast({
  hours,
  isDay,
  unit,
  onUnitChange,
}: {
  hours: HourlyForecastHour[]
  isDay: boolean
  unit: TemperatureUnit
  onUnitChange: (unit: TemperatureUnit) => void
}) {
  return (
    <section aria-labelledby="hourly-title" className="forecast-section hourly-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR DAY, HOUR BY HOUR</span>
          <h2 id="hourly-title">Today&apos;s forecast</h2>
        </div>
        <TemperatureUnitToggle unit={unit} onChange={onUnitChange} />
      </div>
      <div className="hourly-list">
        {hours.length ? hours.map((hour, index) => (
          <article
            className={`hour-card ${index === 0 ? 'current-hour' : ''}`}
            key={hour.time}
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span className="hour-time">
              {index === 0 ? 'Now' : formatHourLabel(hour.time)}
            </span>
            <WeatherIcon
              className="hour-weather-icon"
              code={hour.weatherCode}
              isDay={isDay}
            />
            <strong key={`${hour.time}-${unit}`}>
              {convertTemperature(hour.temperature, unit)}°
            </strong>
            <span className="hour-rain">↓ {hour.precipitation ?? 0}%</span>
          </article>
        )) : Array.from({ length: 6 }, (_, index) => (
          <article className="hour-card" key={`loading-${index}`}>
            <span className="hour-time">—</span>
            <span className="weather-icon-placeholder" />
            <strong>—°</strong>
            <span className="hour-rain">↓ —%</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HourlyForecast
