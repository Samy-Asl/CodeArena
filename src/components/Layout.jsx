import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import SettingsModal from './SettingsModal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useFocus } from '../context/FocusContext.jsx'

// Locked features with shake effect
function LockedItem({ icon, title }) {
  const [shaking, setShaking] = useState(false)
  const [showMsg, setShowMsg] = useState(false)

  function handleClick() {
    if (shaking) return
    setShaking(true)
    setShowMsg(true)
    setTimeout(() => setShaking(false), 600)
    setTimeout(() => setShowMsg(false), 2500)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`sidebar-item sidebar-item--locked${shaking ? ' sidebar-item--shake' : ''}`}
        title={title}
        onClick={handleClick}
      >
        {icon}
        <span className="sidebar-item__lock">🔒</span>
      </button>
      {showMsg && (
        <div className="locked-tooltip">En développement</div>
      )}
    </div>
  )
}

const NAV_ITEMS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/problems', label: 'Défis' },
  { to: '/training/two-sum', label: 'Training' },
  { to: '/marathon', label: 'Marathon' },
  { to: '/profile', label: 'Profil' },
]

export default function Layout() {
  const { focusMode, toggleFocusMode } = useFocus()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className={`app-shell${focusMode ? ' focus-mode-shell' : ''}`}>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}

      {/* Sidebar left */}
      <aside className="app-sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/')} title="CodeArena">
          <img src="/logo.png" alt="CodeArena" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/problems" title="Défis" className={({ isActive }) => `sidebar-item${isActive ? ' sidebar-item--active' : ''}`}>
            ⏰
          </NavLink>
          <NavLink to="/marathon" title="Marathon" className={({ isActive }) => `sidebar-item${isActive ? ' sidebar-item--active' : ''}`}>
            🏃
          </NavLink>
          <NavLink to="/profile" title="Stats" className={({ isActive }) => `sidebar-item${isActive ? ' sidebar-item--active' : ''}`}>
            📊
          </NavLink>
          <LockedItem icon="⚔️" title="Duel — En développement" />
          <LockedItem icon="👥" title="Amis — En développement" />
          <LockedItem icon="✉️" title="Messages — En développement" />
        </nav>
        <div className="sidebar-spacer" />
        <button
          className="sidebar-item"
          title="Paramètres"
          onClick={() => setSettingsOpen(true)}
          style={{ marginBottom: 8 }}
        >
          ⚙️
        </button>
        <div className="sidebar-season">
          <span className="sidebar-season__icon">⚡</span>
          <span className="sidebar-season__label">Version</span>
          <span className="sidebar-season__timer">α1.0.2</span>
        </div>
      </aside>

      {/* Top header */}
      <header className="app-header">
        <div className="header-brand" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => navigate('/')}>
          <img src="/logo.png" alt="CodeArena" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          <span>CODEARENA</span>
        </div>
        <nav className="header-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `header-nav__link${isActive ? ' header-nav__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-spacer" />
        <div className="header-right">
          <div className="header-gems">💎 1,250</div>
          <button className="header-notif">
            🔔
            <span className="header-notif__badge" />
          </button>
          <div className="header-avatar" onClick={() => navigate('/profile')}>
            {user ? (
              <>
                <div className="header-avatar__circle" style={{ background: user.avatarColor }}>
                  {user.initials}
                </div>
                <div className="header-avatar__info">
                  <div className="header-avatar__pseudo">{user.pseudo}</div>
                  <div className="header-avatar__level">Niveau {user.level}</div>
                </div>
              </>
            ) : (
              <>
                <div className="header-avatar__circle" style={{ background: '#7C3AED' }}>DM</div>
                <div className="header-avatar__info">
                  <div className="header-avatar__pseudo">DevMaster</div>
                  <div className="header-avatar__level">Niveau 24</div>
                </div>
              </>
            )}
            <span className="header-avatar__chevron">▾</span>
          </div>
          <button
            className={`focus-toggle${focusMode ? ' focus-toggle--active' : ''}`}
            onClick={toggleFocusMode}
            title={focusMode ? 'Quitter le mode focus' : 'Mode focus'}
          >
            {focusMode ? '🧘 Focus ON' : '🎯 Focus'}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  )
}
