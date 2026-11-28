import type { TemperatureUnit } from '../features/weather/types.ts'

function TemperatureUnitToggle({
  unit,
  onChange,
}: {
  unit: TemperatureUnit
  onChange: (unit: TemperatureUnit) => void
}) {
  return (
    <div aria-label="Temperature unit" className="unit-toggle">
      {(['C', 'F'] as const).map((option) => (
        <button
          aria-label={`Show ${option === 'C' ? 'Celsius' : 'Fahrenheit'}`}
          aria-pressed={unit === option}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          °{option}
        </button>
      ))}
    </div>
  )
}

export default TemperatureUnitToggle
