import { describe, expect, it } from 'vitest'
import {
  formatCurrentDate,
  formatDateLabel,
  formatHourLabel,
  getHourlyForecast,
  getHumidityDescription,
  getTemperatureRangeStyle,
  getWeatherDescription,
  getWindDescription,
} from './weatherUtils.ts'
import { testForecast } from '../test/fixtures.ts'

describe('weather descriptions', () => {
  it('uses the WMO description and a fallback for unknown codes', () => {
    expect(getWeatherDescription(61)).toBe('Light rain')
    expect(getWeatherDescription(999)).toBe('Weather unavailable')
  })

  it('describes humidity and wind at their threshold values', () => {
    expect(getHumidityDescription(80)).toBe('Very humid air')
    expect(getHumidityDescription(60)).toBe('Humid conditions')
    expect(getHumidityDescription(30)).toBe('Dry air')
    expect(getHumidityDescription(31)).toBe('Comfortable humidity')

    expect(getWindDescription(40)).toBe('Strong winds')
    expect(getWindDescription(20)).toBe('Breezy conditions')
    expect(getWindDescription(8)).toBe('Light breeze')
    expect(getWindDescription(7)).toBe('Calm conditions')
  })
})

describe('forecast formatting', () => {
  it('clamps temperature ranges to the display scale', () => {
    expect(getTemperatureRangeStyle(-20, 45)).toEqual({
      left: '0%',
      width: '100%',
    })
    expect(getTemperatureRangeStyle(-100, -99).width).toBe('5%')
  })

  it('formats dates and hour labels in a stable timezone', () => {
    expect(formatDateLabel('2025-01-01', { weekday: 'long' })).toBe('Wednesday')
    expect(formatCurrentDate('2025-01-01T23:00')).toBe('Wednesday, January 1')
    expect(formatHourLabel('2025-01-01T00')).toBe('12AM')
  })

  it('starts hourly data at the current hour and returns at most six entries', () => {
    const hours = getHourlyForecast(testForecast)

    expect(hours).toHaveLength(6)
    expect(hours[0]).toEqual({
      time: '2025-01-01T12:00',
      temperature: 18.4,
      precipitation: 10,
      weatherCode: 2,
    })
    expect(hours.at(-1)?.time).toBe('2025-01-01T17:00')
  })

  it('falls back to the first hour when the current time is not present', () => {
    const forecast = {
      ...testForecast,
      current: { ...testForecast.current, time: '2025-01-01T09:00' },
    }

    expect(getHourlyForecast(forecast)[0]?.time).toBe('2025-01-01T11:00')
    expect(getHourlyForecast(undefined)).toEqual([])
  })
})
