import { FiCheck } from 'react-icons/fi'

export interface JourneyStep {
  status: string
  label: string
  done: boolean
  current: boolean
  at: string | null
}

const DONE = '#4C9A6A'

/**
 * Where an order has got to.
 *
 * Drawn for guests as well as account holders — most people buy without
 * signing up, and the order reference in their email is enough to open this.
 *
 * An order that failed or was cancelled is not on this path at all, so the
 * caller leaves the bar out rather than showing four empty steps.
 */
export default function OrderProgress({
  journey, darkMode, compact = false,
}: {
  journey: JourneyStep[]
  darkMode: boolean
  compact?: boolean
}) {
  if (!journey?.length) return null

  const lastDone = journey.reduce((best, step, i) => (step.done ? i : best), -1)
  // The filled part of the line stops at the step reached, not past it.
  const filled = lastDone <= 0 ? 0 : (lastDone / (journey.length - 1)) * 100
  const line = darkMode ? '#3A3328' : '#EDE4D6'

  return (
    <div className={compact ? 'pt-1' : 'pt-2'}>
      <div className="relative">
        {/* The track, behind the markers */}
        <div
          className="absolute left-0 right-0 rounded-full"
          style={{
            top: compact ? 8 : 11,
            height: 2,
            background: line,
            marginLeft: compact ? 9 : 12,
            marginRight: compact ? 9 : 12,
          }}
        />
        <div
          className="absolute rounded-full transition-all duration-700"
          style={{
            top: compact ? 8 : 11,
            height: 2,
            background: DONE,
            left: compact ? 9 : 12,
            width: `calc((100% - ${compact ? 18 : 24}px) * ${filled / 100})`,
          }}
        />

        <ol className="relative flex justify-between">
          {journey.map(step => (
            <li key={step.status} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
              <span
                aria-hidden
                className="rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500"
                style={{
                  width: compact ? 18 : 24,
                  height: compact ? 18 : 24,
                  background: step.done ? DONE : darkMode ? '#252018' : '#FFFFFF',
                  border: `2px solid ${step.done ? DONE : line}`,
                  boxShadow: step.current ? `0 0 0 4px ${DONE}26` : 'none',
                }}
              >
                {step.done && <FiCheck size={compact ? 10 : 13} className="text-white" />}
              </span>
              <span
                className={`text-center leading-tight ${compact ? 'text-[9px]' : 'text-[10px]'} tracking-wider uppercase ${
                  step.current
                    ? 'font-semibold'
                    : darkMode
                      ? 'text-[#FAF7F2]/45'
                      : 'text-[#4A4A4A]/55'
                }`}
                style={step.current ? { color: DONE } : undefined}
              >
                {step.label}
              </span>
              {!compact && step.at && (
                <span className={`text-[9px] ${darkMode ? 'text-[#FAF7F2]/30' : 'text-[#4A4A4A]/40'}`}>
                  {new Date(step.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
