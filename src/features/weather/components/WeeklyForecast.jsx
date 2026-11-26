import {
  formatDateLabel,
  getTemperatureRangeStyle,
  getWeatherDescription,
} from '../utils/weatherUtils.js'
import WeatherIcon from './WeatherIcon.jsx'

function WeeklyForecast({ daily }) {
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
          <article className="day-row" key={date}>
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
              <span>{Math.round(daily.temperature_2m_min[index])}°</span>
              <i>
                <b
                  style={getTemperatureRangeStyle(
                    daily.temperature_2m_min[index],
                    daily.temperature_2m_max[index],
                  )}
                />
              </i>
              <strong>{Math.round(daily.temperature_2m_max[index])}°</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WeeklyForecast
