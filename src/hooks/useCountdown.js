import { useState, useEffect } from 'react'

/**
 * Counts down from `initialSeconds`.
 * Returns display string (MM:SS), urgency flag, and raw seconds remaining.
 */
export function useCountdown(initialSeconds = 900) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    if (seconds <= 0) return
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [seconds > 0]) // restart only if it was 0

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')

  return {
    display: `${mins}:${secs}`,
    isUrgent: seconds > 0 && seconds <= 60,
    seconds,
    isDone: seconds === 0,
  }
}
