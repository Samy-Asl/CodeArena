import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CodeEditor from '../components/Editor/CodeEditor.jsx'
import ChatSidebar from '../components/Match/ChatSidebar.jsx'
import TestsPanel from '../components/Match/TestsPanel.jsx'
import TimerCircle from '../components/Match/TimerCircle.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { problems } from '../data/problems.js'
import { useTestRunner } from '../hooks/useTestRunner.js'

const AI_DIFFICULTY = {
  Easy: { pseudo:'EasyBot', elo: 900, color:'#22C55E', rank:'Bronze I', initials:'EB', thinkTime: 55 },
  Medium: { pseudo:'CodeNinja', elo: 1845, color:'#EC4899', rank:'Diamond I', initials:'CN', thinkTime: 35 },
  Hard: { pseudo:'GrandMasterX', elo: 2400, color:'#F59E0B', rank:'Grandmaster', initials:'GX', thinkTime: 18 },
}
const DIFF_MAP = { Easy:'easy', Medium:'medium', Hard:'hard' }

function StatsBar({ user, opponent }) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-label">TAUX DE VICTOIRE</span>
        <span className="stat-value">
          {user ? `${user.wins + user.losses > 0 ? Math.round(user.wins/(user.wins+user.losses)*100) : 68}%` : '68.4%'}
        </span>
        <span className="stat-sub">— sparkline —</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">DUELS GAGNÉS</span>
        <span className="stat-icon">🏆</span>
        <span className="stat-value">{user?.wins ?? 342}</span>
      </div>
      <div className="stat-card stat-card--rank">
        <span className="stat-label">RANG ACTUEL</span>
        <span style={{ fontSize:'1.6rem' }}>💎</span>
        <span className="stat-value stat-value--gradient">{user?.rank ?? 'Diamond I'}</span>
        <span className="stat-sub">{user?.elo ?? 1870} ELO</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">MEILLEURE SÉRIE</span>
        <span className="stat-icon">🔥</span>
        <span className="stat-value">12</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">CLASSEMENT GLOBAL</span>
        <span className="stat-value">#432</span>
        <span className="stat-sub">{opponent?.pseudo ?? 'CodeNinja'} opponent</span>
      </div>
    </div>
  )
}

function AuthModal({ onLogin, onClose }) {
  const [pseudo, setPseudo] = useState('')
  const { login } = useAuth()
  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <h2>⚡ Rejoins l'arène</h2>
        <p>Crée ton profil pour lancer un duel, suivre tes stats et grimper dans les classements.</p>
        <input className="modal__input" placeholder="Ton pseudo de joueur…" value={pseudo} onChange={e => setPseudo(e.target.value)} onKeyDown={e => e.key==='Enter' && pseudo.trim() && (login(pseudo.trim()), onLogin())} autoFocus />
        <div className="modal__actions">
          <button className="ui-button ui-button--gradient" style={{ flex:1 }} onClick={() => { if(pseudo.trim()) { login(pseudo.trim()); onLogin() } }}>
            Créer mon profil →
          </button>
          <button className="ui-button ui-button--outline" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  )
}

function SetupModal({ onStart, onClose }) {
  const [selProblem, setSelProblem] = useState(problems[0].id)
  const [aiLevel, setAiLevel] = useState('Medium')
  const [duration, setDuration] = useState(300)
  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal" style={{ width:440 }}>
        <h2>⚔️ Configuration du Duel</h2>
        <p>Choisis ton problème et le niveau de l'IA.</p>
        <label style={{ display:'block', marginBottom:6, fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase' }}>Problème</label>
        <select className="category-select" style={{ width:'100%', marginBottom:14 }} value={selProblem} onChange={e => setSelProblem(e.target.value)}>
          {problems.map(p => <option key={p.id} value={p.id}>[{p.difficulty}] {p.title}</option>)}
        </select>
        <label style={{ display:'block', marginBottom:6, fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase' }}>Niveau IA adversaire</label>
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {['Easy','Medium','Hard'].map(l => (
            <button key={l} className={`ui-button ui-button--small${aiLevel===l?' ui-button--gradient':' ui-button--outline'}`} style={{ flex:1 }} onClick={() => setAiLevel(l)}>{l}</button>
          ))}
        </div>
        <label style={{ display:'block', marginBottom:6, fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase' }}>Durée</label>
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {[{l:'3 min',v:180},{l:'5 min',v:300},{l:'10 min',v:600}].map(d => (
            <button key={d.v} className={`ui-button ui-button--small${duration===d.v?' ui-button--gradient':' ui-button--outline'}`} style={{ flex:1 }} onClick={() => setDuration(d.v)}>{d.l}</button>
          ))}
        </div>
        <div className="modal__actions">
          <button className="ui-button ui-button--gradient" style={{ flex:1 }} onClick={() => onStart(selProblem, aiLevel, duration)}>
            ⚔️ Lancer le Duel !
          </button>
          <button className="ui-button ui-button--outline" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  )
}

function DuelEndModal({ won, myTests, aiTests, eloDelta, problemTitle, onClose, onRematch }) {
  return (
    <div className="modal-overlay">
      <div className="modal duel-end" style={{ width:400 }}>
        <div className="duel-end__result">{won ? '🏆' : '💀'}</div>
        <div className={`duel-end__title${won ? ' duel-end__title--win' : ' duel-end__title--loss'}`}>
          {won ? 'VICTOIRE !' : 'DÉFAITE'}
        </div>
        <div style={{ color:'var(--text-muted)', fontSize:'0.85rem', marginBottom:16 }}>{problemTitle}</div>
        <div className="duel-end__stats">
          <div className="duel-end__stat">
            <div className="duel-end__stat-val" style={{ color:'var(--green)' }}>{myTests}/6</div>
            <div className="duel-end__stat-label">Tes tests</div>
          </div>
          <div className="duel-end__stat">
            <div className="duel-end__stat-val" style={{ color:'var(--pink)' }}>{aiTests}/6</div>
            <div className="duel-end__stat-label">Tests adversaire</div>
          </div>
          <div className="duel-end__stat">
            <div className="duel-end__stat-val" style={{ color: eloDelta>0?'var(--green)':'var(--red)' }}>
              {eloDelta > 0 ? '+' : ''}{eloDelta}
            </div>
            <div className="duel-end__stat-label">ELO</div>
          </div>
          <div className="duel-end__stat">
            <div className="duel-end__stat-val" style={{ color:'var(--cyan)' }}>Diamond I</div>
            <div className="duel-end__stat-label">Rang</div>
          </div>
        </div>
        <div className="duel-end__actions">
          <button className="ui-button ui-button--gradient" onClick={onRematch}>⚔️ Revanche</button>
          <button className="ui-button ui-button--outline" onClick={onClose}>→ Accueil</button>
        </div>
      </div>
    </div>
  )
}

export default function Duel() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [phase, setPhase] = useState('lobby') // lobby | playing | ended
  const [showAuth, setShowAuth] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [problem, setProblem] = useState(problems.find(p => p.id === searchParams.get('problem')) || problems[0])
  const [aiLevel, setAiLevel] = useState('Medium')
  const ai = AI_DIFFICULTY[aiLevel]
  const [lang, setLang] = useState('JavaScript')
  const [myCode, setMyCode] = useState(problem.starterCode?.javascript || '')
  const [aiCode] = useState(problem.solution || '')
  const [timeLeft, setTimeLeft] = useState(300)
  const [totalTime, setTotalTime] = useState(300)
  const [aiResults, setAiResults] = useState([])
  const timerRef = useRef(null)
  const { runTests, results, isRunning, reset } = useTestRunner()
  const [duelResult, setDuelResult] = useState(null)
  const { updateElo, markSolved } = useAuth()

  const allMyPass = results.length > 0 && results.every(r => r.status === 'pass')
  const myPassed = results.filter(r => r.status === 'pass').length

  // AI auto-solve after thinkTime seconds
  useEffect(() => {
    if (phase !== 'playing') return
    const t = setTimeout(() => {
      const fakeResults = problem.testCases.map((_, i) => ({ index: i, status: 'pass', elapsed: 200 }))
      setAiResults(fakeResults)
      if (!allMyPass) {
        endDuel(false, fakeResults)
      }
    }, ai.thinkTime * 1000)
    return () => clearTimeout(t)
  }, [phase, problem]) // eslint-disable-line

  // Win on all tests pass
  useEffect(() => {
    if (allMyPass && phase === 'playing') {
      markSolved(problem.id)
      endDuel(true, aiResults)
    }
  }, [allMyPass]) // eslint-disable-line

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          endDuel(myPassed > aiResults.filter(r=>r.status==='pass').length, aiResults)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase]) // eslint-disable-line

  function endDuel(won, aiRes) {
    clearInterval(timerRef.current)
    const aiPassed = aiRes.filter(r => r.status === 'pass').length
    const eloDelta = won ? 25 : -18
    updateElo(eloDelta)
    setDuelResult({ won, myTests: myPassed, aiTests: aiPassed, eloDelta })
    setPhase('ended')
    addToast(won ? '🏆 Victoire ! +25 ELO' : '💀 Défaite. -18 ELO', won ? 'success' : 'error')
  }

  function startDuel(probId, level, dur) {
    const p = problems.find(x => x.id === probId) || problems[0]
    setProblem(p)
    setAiLevel(level)
    setMyCode(p.starterCode?.javascript || '')
    setTimeLeft(dur)
    setTotalTime(dur)
    reset()
    setAiResults([])
    setDuelResult(null)
    setShowSetup(false)
    setPhase('playing')
  }

  function handleLaunch() {
    if (!user) { setShowAuth(true); return }
    setShowSetup(true)
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2,'0')
  const secs = String(timeLeft % 60).padStart(2,'0')
  const isUrgent = timeLeft < 30

  const lineCount = myCode.split('\n').length

  if (phase === 'lobby') {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'80vh', gap:24, padding:40, textAlign:'center' }}>
        {showAuth && <AuthModal onLogin={() => { setShowAuth(false); setShowSetup(true) }} onClose={() => setShowAuth(false)} />}
        {showSetup && <SetupModal onStart={startDuel} onClose={() => setShowSetup(false)} />}
        <StatsBar user={user} opponent={AI_DIFFICULTY.Medium} />
        <div style={{ fontSize:'4rem', marginTop:40 }}>⚔️</div>
        <h1 style={{ fontSize:'2.5rem', fontWeight:900 }}>Prêt pour le Duel ?</h1>
        <p style={{ color:'var(--text-muted)', maxWidth:480, lineHeight:1.7 }}>
          Affronte une IA ou un joueur en temps réel. Résous le problème en premier pour gagner des ELO et grimper dans le classement.
        </p>
        <button className="ui-button ui-button--gradient" style={{ fontSize:'1.1rem', padding:'16px 40px' }} onClick={handleLaunch}>
          ⚔️ Lancer un Duel
        </button>
        <button className="ui-button ui-button--outline" onClick={() => navigate('/problems')}>
          📚 Voir tous les problèmes
        </button>
      </div>
    )
  }

  return (
    <div className="duel-page">
      {duelResult && (
        <DuelEndModal
          {...duelResult}
          problemTitle={problem.title}
          onClose={() => { setPhase('lobby'); setDuelResult(null) }}
          onRematch={() => startDuel(problem.id, aiLevel, totalTime)}
        />
      )}

      <StatsBar user={user} opponent={ai} />

      <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr var(--right-sidebar-w)', gap:12, padding:'14px 0', alignItems:'start' }}>
        {/* Player 1 (me) */}
        <div className="player-col">
          <div className="panel editor-card editor-card--p1" style={{ display:'flex', flexDirection:'column' }}>
            <div className="player-header">
              <div className="player-avatar player-avatar--p1">
                {user ? user.initials : 'DM'}
                <div className="player-avatar__online" />
              </div>
              <div className="player-info">
                <div className="player-name">{user?.pseudo || 'DevMaster'}</div>
                <div className="player-elo">{user?.elo || 1870} ELO</div>
                <div style={{ display:'flex', gap:6, marginTop:3 }}>
                  <span className="badge badge--violet">{user?.rank || 'Diamond I'}</span>
                </div>
              </div>
              <span className="player-label">PLAYER 1</span>
            </div>

            <div className="panel__header" style={{ justifyContent:'space-between' }}>
              <span>💻 Ton code</span>
              <div className="language-select">
                <select value={lang} onChange={e => { setLang(e.target.value); setMyCode(e.target.value === 'JavaScript' ? problem.starterCode?.javascript : problem.starterCode?.python) }}>
                  <option>JavaScript</option>
                  <option>Python</option>
                </select>
              </div>
            </div>

            <div style={{ flex:1, minHeight:340, display:'flex', flexDirection:'column' }}>
              <CodeEditor language={lang} value={myCode} onChange={setMyCode} />
            </div>

            <div className="editor-footer">
              <div className="editor-footer__status">
                <span className="editor-status-dot" />
                <span>En cours…</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span>{lineCount} / {lineCount} lignes</span>
                <button
                  className="ui-button ui-button--run"
                  onClick={() => runTests(myCode, problem.testCases, problem.fnName)}
                  disabled={isRunning}
                >
                  {isRunning ? '⌛' : '▶ Run'}
                </button>
              </div>
            </div>
          </div>

          <TestsPanel results={results} testCases={problem.testCases} isRunning={isRunning} />
        </div>

        {/* Arena center */}
        <div className="arena-center">
          <div className="arena-problem-title">
            <h3>{problem.title}</h3>
            <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:8, flexWrap:'wrap' }}>
              <span className={`badge badge--${DIFF_MAP[problem.difficulty]}`}>{problem.difficulty}</span>
              <span className="badge badge--cyan" title={problem.description}>ℹ️</span>
            </div>
          </div>

          <div className="vs-container">
            <div className="vs-text">VS</div>
          </div>

          <TimerCircle display={`${mins}:${secs}`} isUrgent={isUrgent} />

          <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', textAlign:'center', lineHeight:1.6 }}>
            <div>{problem.category}</div>
            <div>{problem.testCases.length} tests • {aiLevel} IA</div>
          </div>

          {results.length > 0 && (
            <div style={{ textAlign:'center', fontSize:'0.82rem', color: allMyPass ? 'var(--green)' : 'var(--orange)', fontWeight:700 }}>
              {results.filter(r => r.status==='pass').length}/{results.length} tests ✓
            </div>
          )}

          {aiResults.length > 0 && (
            <div style={{ textAlign:'center', fontSize:'0.78rem', color:'var(--pink)' }}>
              🤖 IA: {aiResults.filter(r=>r.status==='pass').length}/{problem.testCases.length} ✓
            </div>
          )}

          <button
            className="ui-button ui-button--outline ui-button--small"
            style={{ width:'100%' }}
            onClick={() => { clearInterval(timerRef.current); setPhase('lobby') }}
          >
            ✕ Abandonner
          </button>
        </div>

        {/* Player 2 (AI) */}
        <div className="player-col">
          <div className="panel editor-card editor-card--p2" style={{ display:'flex', flexDirection:'column' }}>
            <div className="player-header">
              <div className="player-avatar player-avatar--p2">
                {ai.initials}
                <div className="player-avatar__online" />
              </div>
              <div className="player-info">
                <div className="player-name">{ai.pseudo}</div>
                <div className="player-elo">{ai.elo} ELO</div>
                <div style={{ display:'flex', gap:6, marginTop:3 }}>
                  <span className="badge badge--pink">{ai.rank}</span>
                </div>
              </div>
              <span className="player-label">PLAYER 2</span>
            </div>

            <div className="panel__header">
              <span>🤖 Code adversaire</span>
              <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>lecture seule</span>
            </div>

            <div className="editor-opponent-overlay" style={{ flex:1, minHeight:340, display:'flex', flexDirection:'column' }}>
              <CodeEditor language="JavaScript" value={aiResults.length > 0 ? aiCode : problem.starterCode?.javascript} readOnly />
            </div>

            <div className="editor-footer">
              <div className="editor-footer__status">
                <span className="editor-status-dot" style={{ background: aiResults.length ? 'var(--green)' : 'var(--orange)' }} />
                <span>{aiResults.length > 0 ? 'Terminé ✓' : 'En cours…'}</span>
              </div>
              <span>{problem.starterCode?.javascript?.split('\n').length || 0} lignes</span>
            </div>
          </div>

          {aiResults.length > 0 && (
            <TestsPanel results={aiResults} testCases={problem.testCases} isRunning={false} />
          )}
        </div>

        {/* Right sidebar */}
        <ChatSidebar />
      </div>
    </div>
  )
}
