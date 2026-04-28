import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CodeEditor from '../components/Editor/CodeEditor.jsx'
import TestsPanel from '../components/Match/TestsPanel.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { problems } from '../data/problems.js'
import { useTestRunner } from '../hooks/useTestRunner.js'

const MARATHON_OPTIONS = [
  { count: 3, label: '3 problèmes', desc: 'Sprint rapide — ~15 min', color: 'var(--green)' },
  { count: 5, label: '5 problèmes', desc: 'Course standard — ~25 min', color: 'var(--cyan)' },
  { count: 10, label: '10 problèmes', desc: 'Marathon complet — ~50 min', color: 'var(--pink)' },
]

const TIME_PER_PROBLEM = 5 * 60 // 5 minutes in seconds

function getProgressiveProblems(count) {
  const easy = problems.filter(p => p.difficulty === 'Easy')
  const medium = problems.filter(p => p.difficulty === 'Medium')
  const hard = problems.filter(p => p.difficulty === 'Hard')

  const result = []
  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1 || 1)
    if (ratio < 0.4) result.push(easy[i % easy.length])
    else if (ratio < 0.75) result.push(medium[Math.floor(i / 2) % medium.length])
    else result.push(hard[i % hard.length])
  }
  return result
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

// Selection screen
function SelectionScreen({ onStart }) {
  const [selected, setSelected] = useState(5)

  return (
    <div className="marathon-select">
      <div className="marathon-select__hero">
        <div className="marathon-select__icon">🏃</div>
        <h1 className="marathon-select__title">MODE MARATHON</h1>
        <p className="marathon-select__sub">
          Enchaîne les problèmes en progression de difficulté. Langage fixé : JavaScript.
          5 minutes par problème. Pas de solution disponible — uniquement un guide progressif.
        </p>
      </div>

      <div className="marathon-options">
        {MARATHON_OPTIONS.map(opt => (
          <button
            key={opt.count}
            className={`marathon-option${selected === opt.count ? ' marathon-option--selected' : ''}`}
            style={{ '--opt-color': opt.color }}
            onClick={() => setSelected(opt.count)}
          >
            <span className="marathon-option__label">{opt.label}</span>
            <span className="marathon-option__desc">{opt.desc}</span>
          </button>
        ))}
      </div>

      <div className="marathon-rules">
        <div className="marathon-rule">⏱️ 5 min par problème</div>
        <div className="marathon-rule">📈 Difficulté progressive</div>
        <div className="marathon-rule">🚫 Pas de solution</div>
        <div className="marathon-rule">💡 Guide progressif (4:30 / 4:00 / 3:30)</div>
      </div>

      <button
        className="ui-button ui-button--gradient"
        style={{ fontSize: '1.1rem', padding: '14px 40px' }}
        onClick={() => onStart(selected)}
      >
        🏁 Lancer le Marathon
      </button>
    </div>
  )
}

// Results screen
function ResultsScreen({ score, total, times, onRetry, navigate }) {
  const pct = Math.round((score / total) * 100)
  return (
    <div className="marathon-results">
      <div className="marathon-results__icon">{pct >= 80 ? '🏆' : pct >= 50 ? '🥈' : '💪'}</div>
      <h1 className="marathon-results__title">Marathon terminé !</h1>
      <div className="marathon-results__score">
        <span className="marathon-results__num" style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {score}/{total}
        </span>
        <span className="marathon-results__label">problèmes résolus</span>
      </div>
      <div className="marathon-results__actions">
        <button className="ui-button ui-button--outline" onClick={() => navigate('/problems')}>Retour aux Défis</button>
        <button className="ui-button ui-button--gradient" onClick={onRetry}>Recommencer</button>
      </div>
    </div>
  )
}

export default function Marathon() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [phase, setPhase] = useState('select') // 'select' | 'playing' | 'results'
  const [problemList, setProblemList] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_PROBLEM)
  const [code, setCode] = useState('')
  const [hints, setHints] = useState([])
  const { runTests, results, isRunning, reset } = useTestRunner()
  const timerRef = useRef(null)

  const currentProblem = problemList[currentIdx]

  function startMarathon(count) {
    const list = getProgressiveProblems(count)
    setProblemList(list)
    setCurrentIdx(0)
    setScore(0)
    setCode(list[0].starterCode?.javascript || '')
    setTimeLeft(TIME_PER_PROBLEM)
    setHints([])
    reset()
    setPhase('playing')
  }

  // Progressive hints
  useEffect(() => {
    if (phase !== 'playing' || !currentProblem) return
    const elapsed = TIME_PER_PROBLEM - timeLeft

    if (elapsed >= 30 && !hints.includes(0) && currentProblem.hints[0]) {
      setHints(prev => [...prev, 0])
      addToast('💡 Indice 1 débloqué !', 'info')
    }
    if (elapsed >= 60 && !hints.includes(1) && currentProblem.hints[1]) {
      setHints(prev => [...prev, 1])
      addToast('💡 Indice 2 débloqué !', 'info')
    }
    if (elapsed >= 90 && !hints.includes(2) && currentProblem.hints[2]) {
      setHints(prev => [...prev, 2])
      addToast('💡 Indice 3 débloqué !', 'info')
    }
  }, [timeLeft, phase, currentProblem, hints]) // eslint-disable-line

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleNextProblem(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, currentIdx]) // eslint-disable-line

  function handleNextProblem(solved) {
    clearInterval(timerRef.current)
    if (solved) setScore(s => s + 1)

    const nextIdx = currentIdx + 1
    if (nextIdx >= problemList.length) {
      setPhase('results')
      return
    }
    setCurrentIdx(nextIdx)
    setCode(problemList[nextIdx].starterCode?.javascript || '')
    setTimeLeft(TIME_PER_PROBLEM)
    setHints([])
    reset()
  }

  // Auto-advance on all pass
  useEffect(() => {
    const allPass = results.length > 0 && results.every(r => r.status === 'pass')
    if (allPass) {
      addToast('✓ Résolu ! Prochain problème…', 'success')
      setTimeout(() => handleNextProblem(true), 1200)
    }
  }, [results]) // eslint-disable-line

  function handleRun() {
    if (!currentProblem) return
    runTests(code, currentProblem.testCases, currentProblem.fnName)
  }

  if (phase === 'select') return <SelectionScreen onStart={startMarathon} />
  if (phase === 'results') return (
    <ResultsScreen
      score={score}
      total={problemList.length}
      onRetry={() => setPhase('select')}
      navigate={navigate}
    />
  )

  if (!currentProblem) return null

  const DIFF_MAP = { Easy: 'easy', Medium: 'medium', Hard: 'hard' }
  const pct = (timeLeft / TIME_PER_PROBLEM) * 100
  const isUrgent = timeLeft < 60

  return (
    <div className="marathon-arena">
      {/* Marathon top bar */}
      <div className="marathon-bar">
        <div className="marathon-bar__left">
          <span className="marathon-bar__mode">🏃 MARATHON</span>
          <span className="badge badge--violet">Problème {currentIdx + 1}/{problemList.length}</span>
          <span className={`badge badge--${DIFF_MAP[currentProblem.difficulty]}`}>{currentProblem.difficulty}</span>
        </div>
        <div className="marathon-bar__center">
          <div className={`marathon-timer${isUrgent ? ' marathon-timer--urgent' : ''}`}>
            <div className="marathon-timer__time">{formatTime(timeLeft)}</div>
            <div className="marathon-timer__bar">
              <div
                className="marathon-timer__fill"
                style={{
                  width: `${pct}%`,
                  background: isUrgent ? 'var(--red)' : pct > 50 ? 'var(--green)' : 'var(--orange)'
                }}
              />
            </div>
          </div>
        </div>
        <div className="marathon-bar__right">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Score: <strong style={{ color: 'var(--text)' }}>{score}</strong></span>
          <button className="ui-button ui-button--outline ui-button--small" onClick={() => handleNextProblem(false)}>
            Passer →
          </button>
        </div>
      </div>

      <div className="marathon-layout">
        {/* Problem */}
        <div className="training-zone marathon-problem-zone">
          <div className="zone-header">📋 {currentProblem.title}</div>
          <div className="zone-body">
            <p className="problem-desc">{currentProblem.description}</p>
            <div className="examples">
              <h2>Exemples</h2>
              {currentProblem.examples.map((ex, i) => (
                <div key={i} className="example">
                  <h3>Exemple {i + 1}</h3>
                  <pre>Entrée: {ex.input}{'\n'}Sortie: {ex.output}</pre>
                </div>
              ))}
            </div>

            {hints.length > 0 && (
              <div className="marathon-hints">
                <div className="marathon-hints__title">💡 Indices débloqués ({hints.length})</div>
                {hints.map(hi => (
                  <div key={hi} className="marathon-hint">
                    <span className="marathon-hint__num">{hi + 1}</span>
                    <span>{currentProblem.hints[hi]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor + Tests */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="training-zone" style={{ flex: 2, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className="zone-header">
              <span>💻 Éditeur — JavaScript</span>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CodeEditor language="JavaScript" value={code} onChange={setCode} />
            </div>
            <div className="editor-footer">
              <div className="editor-footer__status">
                <span className="editor-status-dot" />
                <span>Prêt</span>
              </div>
              <button
                className="ui-button ui-button--run"
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? '⌛ Exécution…' : '▶ Exécuter'}
              </button>
            </div>
          </div>

          <div className="training-zone" style={{ flex: 1, minHeight: 0 }}>
            <div className="zone-header">
              <span>🧪 Tests</span>
              {results.length > 0 && (
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: results.every(r => r.status === 'pass') ? 'var(--green)' : 'var(--red)' }}>
                  {results.filter(r => r.status === 'pass').length}/{currentProblem.testCases.length} passés
                </span>
              )}
            </div>
            <div className="zone-body" style={{ padding: 0 }}>
              <TestsPanel results={results} testCases={currentProblem.testCases} isRunning={isRunning} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
