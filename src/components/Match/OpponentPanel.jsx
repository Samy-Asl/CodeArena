import { useEffect, useRef, useState } from 'react'

function OpponentPanel({ problemId }) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('coding')
  const intervalRef = useRef(null)

  useEffect(() => {
    setProgress(0)
    setStatus('coding')

    const totalMs = (90 + Math.random() * 150) * 1000
    const tickMs = 1200
    const increment = (tickMs / totalMs) * 100

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + increment + (Math.random() * 0.6 - 0.3), 100)
        if (next >= 100) {
          clearInterval(intervalRef.current)
          setStatus('submitted')
        }
        return next
      })
    }, tickMs)

    return () => clearInterval(intervalRef.current)
  }, [problemId])

  const pct = Math.round(progress)
  const isSubmitted = status === 'submitted'

  return (
    <div className="opponent-panel">
      <div className="opponent-panel__header">
        <div className="opponent-panel__title">
          <div className="opponent-panel__avatar">A</div>
          Opponent
        </div>
        <span className={`opponent-panel__status${isSubmitted ? ' opponent-panel__status--submitted' : ''}`}>
          {isSubmitted ? '✓ Submitted' : 'Coding…'}
        </span>
      </div>
      <div className="opponent-panel__body">
        <div className="opponent-progress-label">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="opponent-progress-track">
          <div className="opponent-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

export default OpponentPanel
