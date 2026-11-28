import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchForecast } from '../api/forecastApi.ts'
import { searchLocations } from '../api/locationApi.ts'
import { testForecast, testPlaces } from '../test/fixtures.ts'
import WeatherDashboard from './WeatherDashboard.tsx'

vi.mock('../api/forecastApi.ts', () => ({
  fetchForecast: vi.fn(),
}))

vi.mock('../api/locationApi.ts', () => ({
  searchLocations: vi.fn(),
}))

const fetchForecastMock = vi.mocked(fetchForecast)
const searchLocationsMock = vi.mocked(searchLocations)

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  fetchForecastMock.mockReset().mockResolvedValue(testForecast)
  searchLocationsMock.mockReset().mockResolvedValue(testPlaces)
})

describe('WeatherDashboard', () => {
  it('renders the forecast and supports keyboard location selection', async () => {
    render(<WeatherDashboard />)

    expect(
      await screen.findByRole('region', { name: 'Weather in Berlin' }),
    ).toBeInTheDocument()
    expect(
      within(screen.getByRole('region', { name: 'Weather in Berlin' })).getByText(
        '18°',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "Today's forecast" }))
      .toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Next 7 days' }))
      .toBeInTheDocument()

    const searchInput = screen.getByRole('combobox', {
      name: 'Search for a city',
    })
    fireEvent.change(searchInput, { target: { value: 'Lisbon' } })
    expect(
      await screen.findByRole('option', { name: /Lisbon, Portugal/ }),
    ).toBeInTheDocument()

    fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
    fireEvent.keyDown(searchInput, { key: 'Enter' })

    expect(
      await screen.findByRole('region', { name: 'Weather in Lisbon' }),
    ).toBeInTheDocument()
    expect(fetchForecastMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        id: '38.72--9.14',
        name: 'Lisbon',
        latitude: 38.72,
        longitude: -9.14,
      }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('shows forecast errors and retries the request', async () => {
    fetchForecastMock
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce(testForecast)

    render(<WeatherDashboard />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Network unavailable',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(
      await screen.findByRole('region', { name: 'Weather in Berlin' }),
    ).toBeInTheDocument()
    expect(fetchForecastMock).toHaveBeenCalledTimes(2)
  })

  it('switches temperature units and color themes', async () => {
    render(<WeatherDashboard />)

    const weatherRegion = await screen.findByRole('region', {
      name: 'Weather in Berlin',
    })
    fireEvent.click(screen.getByRole('button', { name: 'Show Fahrenheit' }))
    expect(within(weatherRegion).getByText('65°')).toBeInTheDocument()
    expect(within(weatherRegion).getByText(/Feels like/)).toHaveTextContent('64°')

    fireEvent.click(screen.getByRole('button', { name: 'Use dark theme' }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(window.localStorage.getItem('daylight-theme')).toBe('dark')
  })
})
