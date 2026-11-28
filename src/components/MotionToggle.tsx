function MotionToggle({
  isPaused,
  onToggle,
}: {
  isPaused: boolean
  onToggle: () => void
}) {
  const label = isPaused ? 'Resume animations' : 'Pause animations'

  return (
    <button
      aria-label={label}
      aria-pressed={isPaused}
      className="motion-toggle"
      onClick={onToggle}
      type="button"
    >
      {label}
    </button>
  )
}

export default MotionToggle
