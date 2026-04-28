import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CodeEditor from '../components/Editor/CodeEditor.jsx'
import ReplayViewer from '../components/ReplayViewer.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { problems } from '../data/problems.js'
import { useTestRunner } from '../hooks/useTestRunner.js'

const DIFF_MAP = { Easy: 'easy', Medium: 'medium', Hard: 'hard' }

/* ── Drag-to-resize handle ── */
function ResizeHandle({ direction, onResize }) {
  const dragging = useRef(false)
  const last = useRef(0)
  function down(e) {
    dragging.current = true
    last.current = direction === 'h' ? e.clientX : e.clientY
    document.body.style.cursor = direction === 'h' ? 'col-resize' : 'row-resize'
    document.body.style.userSelect = 'none'
    function move(me) {
      if (!dragging.current) return
      const pos = direction === 'h' ? me.clientX : me.clientY
      onResize(pos - last.current)
      last.current = pos
    }
    function up() {
      dragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }
  return <div className={`resize-handle resize-handle--${direction === 'h' ? 'horizontal' : 'vertical'}`} onMouseDown={down} />
}

/* ── Inline Tests Panel (no duplicate border/header) ── */
function TestsInline({ results, testCases, isRunning }) {
  if (!testCases?.length) return null
  const passed = results.filter(r => r.status === 'pass').length
  const total = testCases.length
  const allPass = results.length === total && passed === total
  const hasResults = results.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Test cards grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 12 }}>
        {testCases.map((tc, i) => {
          const res = results[i]
          let borderColor = 'var(--border)'
          let bg = 'var(--test-bg)'
          let icon = isRunning ? '⌛' : '⏳'
          let iconColor = 'var(--text-muted)'
          if (res) {
            if (res.status === 'pass') { borderColor = 'rgba(34,197,94,0.5)'; bg = 'rgba(34,197,94,0.07)'; icon = '✓'; iconColor = 'var(--green)' }
            else { borderColor = 'rgba(239,68,68,0.5)'; bg = 'rgba(239,68,68,0.07)'; icon = '✗'; iconColor = 'var(--red)' }
          }
          const inputStr = JSON.stringify(tc.input).slice(0, 35)
          const expStr = JSON.stringify(tc.expected).slice(0, 25)
          return (
            <div key={i} style={{ flex: '1 1 150px', minWidth: 130, maxWidth: 260, border: `1px solid ${borderColor}`, borderRadius: 8, background: bg, padding: '10px 12px', fontFamily: 'Consolas,monospace', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: 4, transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text)' }}>Test {i + 1}</span>
                <span style={{ fontSize: '1rem', color: iconColor }}>{icon}</span>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>in: {inputStr}</div>
              <div style={{ color: 'var(--text-muted)' }}>exp: {expStr}</div>
              {res?.output !== undefined && (
                <div style={{ color: res.status === 'pass' ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                  got: {JSON.stringify(res.output).slice(0, 25)}
                </div>
              )}
              {res?.message && res.status !== 'pass' && (
                <div style={{ fontSize: '0.65rem', color: 'var(--red)', marginTop: 2, wordBreak: 'break-all', lineHeight: 1.4 }}>
                  {res.message.slice(0, 80)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary bar */}
      {hasResults && (
        <div style={{
          margin: '0 12px 12px',
          padding: '10px 16px',
          borderRadius: 8,
          background: allPass ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${allPass ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: '1.6rem' }}>{allPass ? '✅' : '❌'}</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: '0.9rem', color: allPass ? 'var(--green)' : 'var(--red)' }}>
              {allPass ? 'TOUS LES TESTS RÉUSSIS !' : `${passed}/${total} TESTS PASSÉS`}
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {allPass ? 'Excellent travail 🎉' : `${total - passed} test(s) échoué(s) — vérifie ta logique`}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main Training Component ── */
export default function Training() {
  const { problemId } = useParams()
  const navigate = useNavigate()
  const problem = problems.find(p => p.id === problemId) || problems[0]
  const [lang, setLang] = useState('JavaScript')
  const [code, setCode] = useState(problem.starterCode?.javascript || '')
  const [showSolution, setShowSolution] = useState(false)
  const [failCount, setFailCount] = useState(0)
  const [showReplay, setShowReplay] = useState(false)
  const { runTests, results, isRunning, reset } = useTestRunner()
  const { solved, markSolved } = useAuth()
  const { addToast } = useToast()

  // Layout sizes (px)
  const [problemW, setProblemW] = useState(320)
  const [guideW, setGuideW] = useState(260)
  const [editorH, setEditorH] = useState(440)

  useEffect(() => {
    setCode(lang === 'JavaScript' ? (problem.starterCode?.javascript || '') : (problem.starterCode?.python || ''))
    reset(); setFailCount(0); setShowSolution(false)
  }, [problem.id, lang]) // eslint-disable-line

  const allPass = results.length > 0 && results.every(r => r.status === 'pass')

  useEffect(() => {
    if (allPass && !solved[problem.id]) {
      markSolved(problem.id)
      addToast('✓ Problème résolu ! Enregistré dans ton profil.', 'success')
      setTimeout(() => setShowReplay(true), 800)
    }
  }, [allPass]) // eslint-disable-line

  useEffect(() => {
    if (results.length > 0 && !allPass) {
      setFailCount(p => p + 1)
      addToast(`✗ ${results.filter(r => r.status === 'pass').length}/${results.length} tests passés`, 'error')
    } else if (results.length > 0 && allPass) {
      addToast('✓ Tous les tests réussis ! 🎉', 'success')
    }
  }, [results]) // eslint-disable-line

  function handleRun() {
    if (lang !== 'JavaScript') {
      addToast("Python en cours d'intégration. Utilise JavaScript pour l'instant.", 'warning')
      return
    }
    runTests(code, problem.testCases, problem.fnName)
  }

  return (
    <div className="training-page">
      {showReplay && <ReplayViewer problem={problem} onClose={() => setShowReplay(false)} />}

      {/* ── Top bar ── */}
      <div className="training-topbar">
        <button className="ui-button ui-button--outline ui-button--small" onClick={() => navigate('/problems')}>← Retour</button>
        <h1 className="training-topbar__title">{problem.title}</h1>
        <span className={`badge badge--${DIFF_MAP[problem.difficulty]}`}>{problem.difficulty}</span>
        <span className="badge badge--cyan">{problem.category}</span>
        {solved[problem.id] && <span style={{ color: 'var(--green)', fontWeight: 800, fontSize: '0.88rem' }}>✓ Résolu</span>}
        {allPass && (
          <button className="ui-button ui-button--gradient ui-button--small" onClick={() => navigate('/problems')}>→ Prochain</button>
        )}
      </div>

      {/* ── 4 Zones ── */}
      <div className="training-zones">

        {/* ZONE 1 — PROBLEM */}
        <div className="training-zone" style={{ width: problemW, minWidth: 200, maxWidth: 480, flexShrink: 0 }}>
          <div className="zone-header">📋 Problème</div>
          <div className="zone-body">
            <p className="problem-desc">{problem.description}</p>
            <div className="examples">
              <h2>Exemples</h2>
              {problem.examples.map((ex, i) => (
                <div key={i} className="example">
                  <h3>Exemple {i + 1}</h3>
                  <pre>Entrée: {ex.input}{'\n'}Sortie: {ex.output}</pre>
                </div>
              ))}
            </div>
            <div className="problem-constraints" style={{ marginTop: 16 }}>
              <h2>Contraintes</h2>
              <div className="constraint-list">
                {problem.constraints.map((c, i) => <div key={i} className="constraint-item">• {c}</div>)}
              </div>
            </div>
          </div>
        </div>

        <ResizeHandle direction="h" onResize={d => setProblemW(w => Math.max(200, Math.min(480, w + d)))} />

        {/* ZONE 2+4 — EDITOR + TESTS stacked */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

          {/* EDITOR */}
          <div className="training-zone" style={{ height: editorH, minHeight: 180, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: 0 }}>
            <div className="zone-header">
              <span>💻 Éditeur</span>
              <div className="language-select">
                <span>Langage :</span>
                <select value={lang} onChange={e => setLang(e.target.value)}>
                  <option>JavaScript</option>
                  <option>Python</option>
                </select>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CodeEditor language={lang} value={code} onChange={setCode} />
            </div>
            <div className="editor-footer">
              <div className="editor-footer__status">
                <span className="editor-status-dot" />
                <span>{code.split('\n').length} lignes</span>
              </div>
              <button className="ui-button ui-button--run" onClick={handleRun} disabled={isRunning}>
                {isRunning ? '⌛ Exécution…' : '▶ Exécuter'}
              </button>
            </div>
          </div>

          <ResizeHandle direction="v" onResize={d => setEditorH(h => Math.max(180, Math.min(680, h + d)))} />

          {/* TESTS */}
          <div className="training-zone" style={{ flex: 1, minHeight: 120, borderRight: 0, overflow: 'hidden' }}>
            <div className="zone-header">
              <span>🧪 Tests</span>
              {results.length > 0 && (
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: allPass ? 'var(--green)' : 'var(--red)' }}>
                  {results.filter(r => r.status === 'pass').length} / {problem.testCases.length} passés
                </span>
              )}
              {results.length === 0 && !isRunning && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Clique sur Exécuter</span>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', height: '100%' }}>
              <TestsInline results={results} testCases={problem.testCases} isRunning={isRunning} />
            </div>
          </div>

        </div>

        <ResizeHandle direction="h" onResize={d => setGuideW(w => Math.max(180, Math.min(440, w - d)))} />

        {/* ZONE 3 — GUIDE */}
        <div className="training-zone" style={{ width: guideW, minWidth: 180, maxWidth: 440, flexShrink: 0 }}>
          <div className="zone-header">📖 Guide</div>
          <div className="zone-body guide-body">
            <div>
              <div className="guide-steps__title">Étapes de résolution</div>
              {problem.hints.map((hint, i) => (
                <div key={i} className="guide-step">
                  <div className="guide-step__num">{i + 1}</div>
                  <div className="guide-step__text">{hint}</div>
                </div>
              ))}
            </div>
            <div className="guide-solution">
              <button
                className={`guide-solution__toggle${showSolution ? ' guide-solution__toggle--open' : ''}`}
                onClick={() => {
                  if (!showSolution) {
                    if (failCount < 3) {
                      addToast(`Solution disponible après ${3 - failCount} tentative(s) échouée(s).`, 'info')
                      return
                    }
                    if (window.confirm('Afficher la solution ?')) setShowSolution(true)
                  } else { setShowSolution(false) }
                }}
              >
                <span>
                  {showSolution ? '▲' : '▼'} Voir la solution
                  {failCount < 3 && <span className="guide-solution__lock"> 🔒</span>}
                </span>
                {!showSolution && failCount < 3 && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{3 - failCount} essai(s) restant</span>
                )}
              </button>
              {showSolution && <pre className="guide-solution__code">{problem.solution}</pre>}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
