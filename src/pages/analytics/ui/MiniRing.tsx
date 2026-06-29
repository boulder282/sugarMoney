const SIZE = 44
const STROKE = 6
const CENTER = SIZE / 2
// Padding keeps the stroke's round cap from being clipped by the SVG bounds.
const RADIUS = (SIZE - STROKE) / 2 - 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface MiniRingProps {
  /** Filled fraction of the ring, 0–1. */
  progress: number
  color: string
}

const MiniRing = ({ progress, color }: MiniRingProps) => {
  const filled = Math.min(Math.max(progress, 0), 1) * CIRCUMFERENCE

  return (
    <svg width={SIZE} height={SIZE} className="-rotate-90">
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke="#2A2B2C"
        strokeWidth={STROKE}
      />
      {progress > 0 && (
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={`${filled} ${CIRCUMFERENCE - filled}`}
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

export default MiniRing
