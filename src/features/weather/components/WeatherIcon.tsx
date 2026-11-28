const rainyCodes = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99])
const snowyCodes = new Set([71, 73, 75, 77, 85, 86])
const foggyCodes = new Set([45, 48])
const clearCodes = new Set([0, 1])

function WeatherIcon({
  code,
  isDay = true,
  className = '',
}: {
  code: number
  isDay?: boolean
  className?: string
}) {
  const isRainy = rainyCodes.has(code)
  const isSnowy = snowyCodes.has(code)
  const isCloudy = code !== 0 && !foggyCodes.has(code)
  const isFoggy = foggyCodes.has(code)
  const motionClass = isRainy
    ? 'weather-icon--rain'
    : isSnowy
      ? 'weather-icon--snow'
      : isFoggy
        ? 'weather-icon--fog'
        : isCloudy
          ? 'weather-icon--cloud'
          : isDay
            ? 'weather-icon--sun'
            : 'weather-icon--moon'

  return (
    <svg
      aria-hidden="true"
      className={`weather-icon ${motionClass} ${className}`}
      fill="none"
      viewBox="0 0 64 64"
    >
      {clearCodes.has(code) && isDay && (
        <g className="icon-sun-rays-group">
          <circle className="icon-sun" cx="30" cy="27" r="13" />
          <path
            className="icon-sun-rays"
            d="M30 4v5m0 36v5M7 27h5m36 0h5M14 11l4 4m25 25 4 4m0-33-4 4M18 39l-4 4"
          />
        </g>
      )}
      {isCloudy && (
        <path
          className="icon-cloud"
          d="M16 45h31a10 10 0 0 0 1-20 18 18 0 0 0-34-1 11 11 0 0 0 2 21Z"
        />
      )}
      {isFoggy && (
        <path className="icon-fog" d="M16 38h32M12 46h36M20 54h24" />
      )}
      {isRainy && (
        <path className="icon-rain" d="m23 49-3 7m16-7-3 7m16-7-3 7" />
      )}
      {isSnowy && (
        <path className="icon-snow" d="M23 51v8m-4-4h8m12-4v8m-4-4h8" />
      )}
      {!isDay && !isCloudy && (
        <path className="icon-moon" d="M42 12A19 19 0 1 0 53 44 20 20 0 0 1 42 12Z" />
      )}
      {code === 95 || code === 96 || code === 99 ? (
        <path className="icon-lightning" d="m34 40-7 11h7l-4 9 13-15h-8l5-5" />
      ) : null}
    </svg>
  )
}

export default WeatherIcon
