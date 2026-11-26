import {
  getHumidityDescription,
  getWindDescription,
} from '../utils/weatherUtils.ts'
import type { CurrentWeather } from '../types.ts'

function WeatherDetails({
  current,
  precipitationChance = 0,
}: {
  current: CurrentWeather | undefined
  precipitationChance?: number
}) {
  return (
    <section aria-label="Weather details" className="details-grid">
      <article className="detail-card">
        <div className="detail-card-heading">
          <span className="detail-icon humidity-icon">◌</span>
          <span>Humidity</span>
        </div>
        <strong>{current ? `${current.relative_humidity_2m}%` : '—'}</strong>
        <span className="detail-note">
          {current
            ? getHumidityDescription(current.relative_humidity_2m)
            : 'Relative humidity'}
        </span>
        <div aria-hidden="true" className="meter">
          <span style={{ width: `${current?.relative_humidity_2m ?? 0}%` }} />
        </div>
      </article>
      <article className="detail-card">
        <div className="detail-card-heading">
          <span className="detail-icon wind-icon">↗</span>
          <span>Wind speed</span>
        </div>
        <strong>
          {current ? <>{Math.round(current.wind_speed_10m)} <small>km/h</small></> : '—'}
        </strong>
        <span className="detail-note">
          {current
            ? getWindDescription(current.wind_speed_10m)
            : 'Current wind conditions'}
        </span>
        <div aria-hidden="true" className="wind-decoration"><i /><i /><i /></div>
      </article>
      <article className="detail-card">
        <div className="detail-card-heading">
          <span className="detail-icon rain-icon">⌁</span>
          <span>Precipitation</span>
        </div>
        <strong>
          {current ? <>{current.precipitation} <small>mm</small></> : '—'}
        </strong>
        <span className="detail-note">
          Chance of rain <b>{precipitationChance}%</b>
        </span>
        <div aria-hidden="true" className="rain-decoration">
          <span /><span /><span /><span /><span />
        </div>
      </article>
    </section>
  )
}

export default WeatherDetails
