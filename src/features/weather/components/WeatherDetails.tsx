import {
  getHumidityDescription,
  getWindDescription,
} from '../utils/weatherUtils.ts'
import type { CurrentWeather } from '../types.ts'

type MetricIconName = 'humidity' | 'wind' | 'precipitation'

function MetricIcon({ name }: { name: MetricIconName }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {name === 'humidity' && <path d="M12 3S5.5 10.5 5.5 15a6.5 6.5 0 0 0 13 0C18.5 10.5 12 3 12 3Z" />}
      {name === 'wind' && <path d="M3 8h12a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h5a3 3 0 1 1-3 3" />}
      {name === 'precipitation' && (
        <>
          <path d="M6 15.5h11a3.5 3.5 0 0 0 .4-7A5.5 5.5 0 0 0 7 9a3.3 3.3 0 0 0-1 6.5Z" />
          <path d="m9 18-1 2m5-2-1 2m5-2-1 2" />
        </>
      )}
    </svg>
  )
}

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
          <span className="detail-icon humidity-icon"><MetricIcon name="humidity" /></span>
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
          <span className="detail-icon wind-icon"><MetricIcon name="wind" /></span>
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
          <span className="detail-icon rain-icon"><MetricIcon name="precipitation" /></span>
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
