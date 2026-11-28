import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function readStoredTheme(): Theme {
  try {
    return window.localStorage.getItem('daylight-theme') === 'dark'
      ? 'dark'
      : 'light'
  } catch {
    return 'light'
  }
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z" />
    </svg>
  )
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem('daylight-theme', theme)
    } catch {
      // The selected theme remains active for this page session.
    }
  }, [theme])

  return (
    <div aria-label="Color theme" className="theme-toggle" role="group">
      <button
        aria-label="Use light theme"
        aria-pressed={theme === 'light'}
        onClick={() => setTheme('light')}
        type="button"
      >
        <SunIcon />
      </button>
      <button
        aria-label="Use dark theme"
        aria-pressed={theme === 'dark'}
        onClick={() => setTheme('dark')}
        type="button"
      >
        <MoonIcon />
      </button>
    </div>
  )
}

export default ThemeToggle
