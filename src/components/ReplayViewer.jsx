import { useCallback, useEffect, useRef, useState } from 'react'

function buildSteps(solution) {
  const lines = solution.split('\n')
  return lines.map((line, i) => ({
    lineIndex: i,
    vars: {
      line: i + 1,
      progress: `${Math.round(((i + 1) / lines.length) * 100)}%`,
      status: i === lines.length - 1 ? 'return' : 'running',
    },
  }))
}

export default function ReplayViewer({ problem, onClose }) {
  const solution = problem?.solution || '// No solution'
  const steps = buildSteps(solution)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const intervalRef = useRef(null)
  const lines = solution.split('\n')

  const tick = useCallback(() => {
    setStep(prev => {
      if (prev >= steps.length - 1) { setPlaying(false); return prev }
      return prev + 1
    })
  }, [steps.length])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(tick, 800 / speed)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, speed, tick])

  const cur = steps[step] || steps[0]

  return (
    <div className="replay-modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="replay-container">
        <div className="replay-header">
          <span style={{ fontSize: '1.2rem' }}>🎬</span>
          <span className="replay-title">Replay — {problem?.title}</span>
          <button className="replay-btn" onClick={onClose}>✕ Fermer</button>
        </div>

        <div className="replay-body">
          <div className="replay-code">
            <pre>
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={`replay-code__line${i === cur.lineIndex ? ' replay-code__line--current' : ''}`}
                >
                  <span style={{ color: '#374151', marginRight: '16px', userSelect: 'none', fontSize: '0.75rem' }}>
                    {String(i + 1).padStart(2, ' ')}
                  </span>
                  {line || ' '}
                </div>
              ))}
            </pre>
          </div>
          <div className="replay-vars">
            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
              État des variables
            </div>
            {Object.entries(cur.vars).map(([k, v]) => (
              <div key={k} className="replay-var">
                <span className="replay-var__key">{k}</span>
                <span className="replay-var__val">{String(v)}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Étape {step + 1} / {steps.length}
            </div>
          </div>
        </div>

        <div className="replay-controls">
          <button className="replay-btn" onClick={() => setStep(0)}>⏮</button>
          <button className="replay-btn" onClick={() => setStep(s => Math.max(0, s - 1))}>◀</button>
          <button className="replay-btn" onClick={() => setPlaying(p => !p)}>{playing ? '⏸' : '▶'}</button>
          <button className="replay-btn" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}>▶|</button>
          <div className="replay-progress" onClick={e => {
            const pct = e.nativeEvent.offsetX / e.currentTarget.clientWidth
            setStep(Math.round(pct * (steps.length - 1)))
          }}>
            <div className="replay-progress__fill" style={{ width: `${(step / Math.max(steps.length - 1, 1)) * 100}%` }} />
          </div>
          <span className="replay-speed">
            {[0.5, 1, 2].map(s => (
              <button key={s} className="replay-btn" style={{ padding: '4px 8px', marginLeft: 4, ...(speed === s ? { borderColor: 'var(--primary)', color: 'var(--primary-hover)' } : {}) }} onClick={() => setSpeed(s)}>
                x{s}
              </button>
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}
