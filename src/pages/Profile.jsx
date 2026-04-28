import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { problems } from '../data/problems.js'

function buildActivityGrid(activity) {
  const weeks = 12
  const today = new Date()
  const cells = []
  for (let w = weeks - 1; w >= 0; w--) {
    const week = []
    for (let d = 6; d >= 0; d--) {
      const dt = new Date(today)
      dt.setDate(dt.getDate() - w * 7 - d)
      const key = dt.toISOString().slice(0, 10)
      const count = activity[key] || 0
      week.push({ key, count })
    }
    cells.push(week)
  }
  return cells
}

function activityLevel(count) {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count <= 4) return 3
  return 4
}

export default function Profile() {
  const { user, login, solved, activity, logout } = useAuth()
  const navigate = useNavigate()
  const [pseudo, setPseudo] = useState('')

  if (!user) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'70vh', gap:20, padding:40, textAlign:'center' }}>
        <div style={{ fontSize:'4rem' }}>👤</div>
        <h1 style={{ fontSize:'1.8rem', fontWeight:900 }}>Crée ton profil</h1>
        <p style={{ color:'var(--text-muted)', maxWidth:400, lineHeight:1.7 }}>
          Suivi de progression, streak quotidienne, grille d'activité GitHub-style et ELO ranking.
        </p>
        <input
          className="modal__input"
          placeholder="Ton pseudo…"
          value={pseudo}
          onChange={e => setPseudo(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && pseudo.trim() && login(pseudo.trim())}
          style={{ maxWidth: 320, marginBottom: 0 }}
        />
        <button className="ui-button ui-button--gradient" onClick={() => pseudo.trim() && login(pseudo.trim())}>
          Créer mon profil →
        </button>
      </div>
    )
  }

  const solvedList = problems.filter(p => solved[p.id])
  const winRate = user.wins + user.losses > 0 ? Math.round(user.wins / (user.wins + user.losses) * 100) : 0
  const grid = buildActivityGrid(activity)
  const totalActivity = Object.values(activity).reduce((a, b) => a + b, 0)

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-large" style={{ background: user.avatarColor }}>
          {user.initials}
        </div>
        <div>
          <div className="profile-name">{user.pseudo}</div>
          <div className="profile-rank">
            <span className="badge badge--violet" style={{ marginRight: 8 }}>{user.rank}</span>
            {user.elo} ELO • Niveau {user.level}
          </div>
          <div style={{ marginTop: 10, display:'flex', gap: 8 }}>
            <button className="ui-button ui-button--outline ui-button--small" onClick={logout}>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <div className="profile-stat__val text-gradient">{solvedList.length}</div>
          <div className="profile-stat__label">Résolus</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat__val" style={{ color:'var(--green)' }}>{user.wins}</div>
          <div className="profile-stat__label">Victoires</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat__val" style={{ color:'var(--red)' }}>{user.losses}</div>
          <div className="profile-stat__label">Défaites</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat__val" style={{ color:'var(--orange)' }}>{winRate}%</div>
          <div className="profile-stat__label">Win Rate</div>
        </div>
      </div>

      <div className="activity-grid">
        <h2>Activité — {totalActivity} soumissions (12 semaines)</h2>
        <div className="activity-cells">
          {grid.map((week, wi) => (
            <div key={wi} className="activity-week">
              {week.map(cell => (
                <div
                  key={cell.key}
                  className={`activity-cell activity-cell--${activityLevel(cell.count)}`}
                  title={`${cell.key}: ${cell.count} soumission(s)`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="solved-list">
        <h2>Problèmes résolus ({solvedList.length})</h2>
        {solvedList.length === 0 && (
          <div style={{ padding:'20px 18px', color:'var(--text-muted)', fontSize:'0.88rem' }}>
            Aucun problème résolu encore.{' '}
            <span style={{ color:'var(--primary-hover)', cursor:'pointer' }} onClick={() => navigate('/problems')}>
              Voir les défis →
            </span>
          </div>
        )}
        {solvedList.map(p => (
          <div key={p.id} className="solved-item" onClick={() => navigate(`/training/${p.id}`)} style={{ cursor:'pointer' }}>
            <span style={{ color:'var(--green)' }}>✓</span>
            <span style={{ flex:1, fontWeight:700 }}>{p.title}</span>
            <span className={`badge badge--${{Easy:'easy',Medium:'medium',Hard:'hard'}[p.difficulty]}`}>{p.difficulty}</span>
            <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{p.category}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
