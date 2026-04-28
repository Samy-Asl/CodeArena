export default function TimerCircle({ display, isUrgent }) {
  const R = 48
  const C = 2 * Math.PI * R

  return (
    <div className="timer-circle-wrap">
      <svg className="timer-circle-svg" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <circle cx="55" cy="55" r={R} stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="55" cy="55" r={R}
          stroke="url(#timerGrad)" strokeWidth="3"
          strokeDasharray={`${C * 0.75} ${C * 0.25}`}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
        />
      </svg>
      <div className={`timer-circle-inner${isUrgent ? ' timer--urgent' : ''}`}>
        <span className="timer-label">TEMPS RESTANT</span>
        <span className="timer-value">{display}</span>
      </div>
    </div>
  )
}
