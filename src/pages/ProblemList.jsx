import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { CATEGORIES, problems } from '../data/problems.js'

const DIFFS = ['Tous', 'Easy', 'Medium', 'Hard']
const DIFF_MAP = { Easy: 'easy', Medium: 'medium', Hard: 'hard' }

export default function ProblemList() {
  const [diff, setDiff] = useState('Tous')
  const [cat, setCat] = useState('Toutes')
  const [search, setSearch] = useState('')
  const { solved } = useAuth()
  const navigate = useNavigate()

  const filtered = problems.filter(p => {
    const matchDiff = diff === 'Tous' || p.difficulty === diff
    const matchCat = cat === 'Toutes' || p.category === cat
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchDiff && matchCat && matchSearch
  })

  return (
    <div className="problems-page">
      <h1>Défis Algorithmiques</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
        {problems.length} problèmes • {Object.keys(solved).length} résolus
      </p>

      <div className="problems-filters">
        <div className="filter-pills">
          {DIFFS.map(d => (
            <button
              key={d}
              className={`filter-pill filter-pill--${d === 'Tous' ? 'all' : d.toLowerCase()}${diff === d ? ' filter-pill--active' : ''}`}
              onClick={() => setDiff(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <select className="category-select" value={cat} onChange={e => setCat(e.target.value)}>
          <option value="Toutes">Toutes catégories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          className="search-input"
          placeholder="🔍 Rechercher…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="panel" style={{ overflow: 'auto' }}>
        <table className="problems-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Titre</th>
              <th>Difficulté</th>
              <th>Catégorie</th>
              <th>Tags</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} onClick={() => navigate(`/training/${p.id}`)}>
                <td style={{ color: 'var(--text-muted)', fontFamily: 'Consolas,monospace' }}>{i + 1}</td>
                <td className="problem-title-cell">{p.title}</td>
                <td><span className={`badge badge--${DIFF_MAP[p.difficulty]}`}>{p.difficulty}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{p.category}</td>
                <td>
                  <div className="problem-tags">
                    {p.tags.slice(0, 2).map(t => <span key={t} className="tag-pill">{t}</span>)}
                  </div>
                </td>
                <td>{solved[p.id] ? <span className="solved-check">✓</span> : <span style={{ color: 'var(--border)' }}>—</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="ui-button ui-button--small"
                      onClick={e => { e.stopPropagation(); navigate(`/training/${p.id}`) }}
                    >
                      🎯 S'entraîner
                    </button>
                    <button
                      className="ui-button ui-button--small ui-button--pink"
                      onClick={e => { e.stopPropagation(); navigate(`/duel?problem=${p.id}`) }}
                    >
                      ⚔️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            Aucun problème trouvé pour ces filtres
          </div>
        )}
      </div>
    </div>
  )
}
