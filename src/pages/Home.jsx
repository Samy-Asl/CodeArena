import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroCanvas from '../components/HeroCanvas.jsx'

/* Locked mode card — shake on click, shows temporary message */
function LockedCard({ className, bgStyle, title, titleStyle, desc, icon }) {
  const [shaking, setShaking] = useState(false)
  const [showMsg, setShowMsg] = useState(false)

  function handleClick() {
    if (shaking) return
    setShaking(true)
    setShowMsg(true)
    setTimeout(() => setShaking(false), 550)
    setTimeout(() => setShowMsg(false), 2800)
  }

  return (
    <div
      className={`mode-card-v2 mode-card-v2--locked ${className}${shaking ? ' sidebar-item--shake' : ''}`}
      onClick={handleClick}
      style={{ cursor: 'default' }}
    >
      {bgStyle}
      <div className="mode-card-v2__content">
        <div className="mode-card-v2__title" style={titleStyle}>{icon} {title}</div>
        <div className="mode-card-v2__desc">{desc}</div>
        <div className="mode-card-v2__btn mode-card-v2__btn--locked">
          🔒 Bientôt disponible <span className="lock-chains">⛓️</span>
        </div>
      </div>
      {showMsg && (
        <div className="card-locked-msg">
          🚧 Mode en cours de développement
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="home-page">
      <HeroCanvas />
      <div className="home-content">

        {/* HERO */}
        <section className="hero-section">
          <div className="hero-eyebrow">⚡ La plateforme de coding compétitif</div>
          <h1 className="hero-title">CODEARENA</h1>
          <p className="hero-sub">Affronte d'autres développeurs en duel de code en temps réel. Améliore tes skills. Grimpe dans les classements.</p>
          <div className="hero-ctas">
            <button className="ui-button ui-button--gradient" style={{ fontSize: '1rem', padding: '14px 32px' }} onClick={() => navigate('/marathon')}>
              🏃 Mode Marathon
            </button>
            <button className="ui-button ui-button--outline" style={{ fontSize: '1rem', padding: '14px 32px' }} onClick={() => navigate('/problems')}>
              📚 Voir les Défis
            </button>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-section">
          <h2 className="section-title">Comment ça marche ?</h2>
          <div className="how-steps">
            {[
              { num: '1', title: 'Choisis un problème', desc: 'Sélectionne parmi 20 défis classés Easy / Medium / Hard dans plusieurs catégories algorithmiques.' },
              { num: '2', title: 'Affronte en temps réel', desc: 'Code face à un adversaire IA ou un joueur. Timer, ELO, classement — tout est en jeu.' },
              { num: '3', title: 'Progresse & grimpe', desc: 'Analyse ton replay, découvre les hints, et monte dans les rangs de Diamond à Grandmaster.' },
            ].map(s => (
              <div key={s.num} className="how-step">
                <div className="how-step__num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MODES */}
        <section className="modes-section">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 28 }}>Choisis ton Mode</h2>
          <div className="mode-cards">

            {/* MARATHON — available */}
            <div className="mode-card-v2 mode-card-v2--marathon" onClick={() => navigate('/marathon')}>
              <div className="mode-card-v2__bg" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(59,130,246,0.3), transparent 60%)' }} />
              <div className="mode-card-v2__content">
                <div className="mode-card-v2__title">🏃 MARATHON</div>
                <div className="mode-card-v2__desc">Enchaîne les problèmes sans pause. Qui tient le plus longtemps ?</div>
                <div className="mode-card-v2__btn">JOUER ›</div>
              </div>
            </div>

            {/* HTML/CSS — LOCKED */}
            <LockedCard
              className="mode-card-v2--html"
              bgStyle={<div className="mode-card-v2__bg" style={{ background: 'radial-gradient(circle at 20% 80%, rgba(236,72,153,0.35), transparent 60%)' }} />}
              icon="</>"
              title="HTML/CSS BATTLE"
              titleStyle={{ color: 'var(--pink)' }}
              desc="Reproduis un design pixel-perfect. La créativité contre la précision."
            />

            {/* DISCOVER — available */}
            <div className="mode-card-v2 mode-card-v2--discover" onClick={() => navigate('/training/two-sum')}>
              <div className="mode-card-v2__bg" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.3), transparent 65%)' }} />
              <div className="mode-card-v2__content">
                <div className="mode-card-v2__title" style={{ color: 'var(--primary-hover)' }}>🌙 DISCOVER</div>
                <div className="mode-card-v2__desc">Mode entraînement avec hints progressifs. Parfait pour apprendre sans pression.</div>
                <div className="mode-card-v2__btn">JOUER ›</div>
              </div>
            </div>

          </div>
        </section>

        {/* STATS */}
        <section className="stats-section">
          <h2 className="section-title">La plateforme en chiffres</h2>
          <div className="stats-pills">
            {[{ num: '20+', label: 'Problèmes' }, { num: '2', label: 'Langages' }, { num: '3', label: 'Niveaux' }, { num: '∞', label: 'Duels' }].map(s => (
              <div key={s.label} className="stats-pill">
                <div className="stats-pill__num">{s.num}</div>
                <div className="stats-pill__label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2>Prêt à entrer dans l'arène ?</h2>
          <p>Rejoins des milliers de développeurs qui s'affrontent chaque jour.</p>
          <button className="ui-button ui-button--gradient" style={{ fontSize: '1.05rem', padding: '14px 36px' }} onClick={() => navigate('/marathon')}>
            ⚔️ Commencer maintenant
          </button>
        </section>

      </div>
    </div>
  )
}
