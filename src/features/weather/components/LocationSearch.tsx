import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import useLocationSearch from '../hooks/useLocationSearch.ts'
import type { GeocodingLocation } from '../types.ts'
import LocationPinIcon from './LocationPinIcon.tsx'
import SearchIcon from './SearchIcon.tsx'

function LocationSearch({
  onSelectLocation,
}: {
  onSelectLocation: (place: GeocodingLocation) => void
}) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const { suggestions, isSearching, error } = useLocationSearch(query, isOpen)

  useEffect(() => {
    function focusSearch(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  function chooseLocation(place: GeocodingLocation) {
    onSelectLocation(place)
    setQuery('')
    setIsOpen(false)
    setActiveSuggestion(-1)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault()
      setActiveSuggestion((current) => (current + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault()
      setActiveSuggestion((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      )
    } else if (event.key === 'Enter' && suggestions.length) {
      event.preventDefault()
      chooseLocation(suggestions[activeSuggestion < 0 ? 0 : activeSuggestion])
    } else if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveSuggestion(-1)
    }
  }

  const shouldShowSuggestions = isOpen && query.trim().length >= 2

  return (
    <div className="search-wrap">
      <label className="search-box">
        <SearchIcon />
        <input
          ref={inputRef}
          aria-activedescendant={
            activeSuggestion >= 0 ? `location-option-${activeSuggestion}` : undefined
          }
          aria-autocomplete="list"
          aria-controls="location-suggestions"
          aria-expanded={shouldShowSuggestions}
          aria-label="Search for a city"
          autoComplete="off"
          onBlur={() => setIsOpen(false)}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
            setActiveSuggestion(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search a city..."
          role="combobox"
          value={query}
        />
        <kbd>⌘ K</kbd>
      </label>

      {shouldShowSuggestions && (
        <div
          aria-label="Location suggestions"
          className="suggestions"
          id="location-suggestions"
          role="listbox"
        >
          {isSearching && <p className="suggestion-message">Finding places...</p>}
          {!isSearching &&
            suggestions.map((place, index) => (
              <button
                aria-selected={activeSuggestion === index}
                className={`suggestion ${activeSuggestion === index ? 'is-active' : ''}`}
                id={`location-option-${index}`}
                key={`${place.id}-${place.latitude}-${place.longitude}`}
                onClick={() => chooseLocation(place)}
                onMouseDown={(event) => event.preventDefault()}
                role="option"
                type="button"
              >
                <span className="suggestion-pin"><LocationPinIcon /></span>
                <span>
                  <strong>{place.name}</strong>
                  <small>
                    {[place.admin1, place.country].filter(Boolean).join(', ')}
                  </small>
                </span>
              </button>
            ))}
          {!isSearching && error && <p className="suggestion-message">{error}</p>}
        </div>
      )}
    </div>
  )
}

export default LocationSearch
