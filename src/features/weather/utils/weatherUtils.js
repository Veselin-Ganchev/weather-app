//Declare constants for weather descriptions based on weather codes
const weatherDescriptions = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  56: 'Freezing drizzle',
  57: 'Freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
}

export function getWeatherDescription(code) {
  return weatherDescriptions[code] ?? 'Weather unavailable'
}

export function getHumidityDescription(humidity) {
  if (humidity >= 80) return 'Very humid air'
  if (humidity >= 60) return 'Humid conditions'
  if (humidity <= 30) return 'Dry air'
  return 'Comfortable humidity'
}

export function getWindDescription(speed) {
  if (speed >= 40) return 'Strong winds'
  if (speed >= 20) return 'Breezy conditions'
  if (speed >= 8) return 'Light breeze'
  return 'Calm conditions'
}

export function getTemperatureRangeStyle(minimum, maximum) {
  const scaleMinimum = -20
  const scaleRange = 65
  const width = Math.min(100, Math.max(5, ((maximum - minimum) / scaleRange) * 100))

  return {
    left: `${Math.min(100 - width, Math.max(0, ((minimum - scaleMinimum) / scaleRange) * 100))}%`,
    width: `${width}%`,
  }
}

export function formatDateLabel(date, options) {
  return new Intl.DateTimeFormat('en', { timeZone: 'UTC', ...options }).format(
    new Date(`${date}T12:00:00Z`),
  )
}

export function formatCurrentDate(currentTime) {
  const date = currentTime.split('T')[0]

  return formatDateLabel(date, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function formatHourLabel(hour) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  })
    .format(new Date(`${hour}:00Z`))
    .replace(' ', '')
}

export function getHourlyForecast(forecast) {
  const { current, hourly } = forecast ?? {}
  if (!current || !hourly?.time) return []

  const currentHourIndex = hourly.time.indexOf(current.time)
  const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0

  return hourly.time.slice(startIndex, startIndex + 6).map((time, index) => {
    const sourceIndex = startIndex + index

    return {
      time,
      temperature: hourly.temperature_2m[sourceIndex],
      precipitation: hourly.precipitation_probability?.[sourceIndex],
      weatherCode: hourly.weather_code?.[sourceIndex] ?? current.weather_code,
    }
  })
}
