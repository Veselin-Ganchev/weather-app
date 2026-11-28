import {
  formatDateLabel,
  getTemperatureRangeStyle,
  getWeatherDescription,
} from '../utils/weatherUtils.ts'
import type { DailyForecastData, TemperatureUnit } from '../types.ts'
import WeatherIcon from './WeatherIcon.tsx'
import { convertTemperature } from '../utils/weatherUtils.ts'

function WeeklyForecast({
  daily,
  unit,
}: {
  daily: DailyForecastData | undefined
  unit: TemperatureUnit
}) {
  return (
    <section aria-labelledby="week-title" className="forecast-section week-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PLAN A LITTLE AHEAD</span>
          <h2 id="week-title">Next 7 days</h2>
        </div>
        <span className="week-range">Daily forecast</span>
      </div>
      <div className="week-list">
        {daily?.time.map((date, index) => (
          <article
            className="day-row"
            key={date}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span className="day-name">
              <strong>
                {index === 0 ? 'Today' : formatDateLabel(date, { weekday: 'long' })}
              </strong>
              <small>{formatDateLabel(date, { month: 'short', day: 'numeric' })}</small>
            </span>
            <WeatherIcon className="day-weather-icon" code={daily.weather_code[index]} />
            <span className="day-condition">
              {getWeatherDescription(daily.weather_code[index])}
            </span>
            <div
              aria-label={`${daily.temperature_2m_min[index]} to ${daily.temperature_2m_max[index]} degrees`}
              className="temperature-range"
            >
              <span>{convertTemperature(daily.temperature_2m_min[index], unit)}°</span>
              <i>
                <b
                  style={getTemperatureRangeStyle(
                    daily.temperature_2m_min[index],
                    daily.temperature_2m_max[index],
                  )}
                />
              </i>
              <strong>{convertTemperature(daily.temperature_2m_max[index], unit)}°</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WeeklyForecast
