import { useEffect, useRef, useState } from 'react'
import { useFocus } from '../context/FocusContext.jsx'

export default function SettingsModal({ onClose }) {
  const { focusMode, toggleFocusMode, theme, setTheme, density, setDensity } = useFocus()
  const overlayRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose() }}>
      <div className="settings-modal">
        <div className="settings-modal__header">
          <span>⚙️ Paramètres</span>
          <button className="settings-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-section">
          <div className="settings-section__title">🎯 MODE FOCUS</div>
          <div className="settings-row">
            <div className="settings-row__info">
              <div className="settings-row__label">Mode Focus</div>
              <div className="settings-row__desc">UI simplifiée, animations réduites, moins de distractions</div>
            </div>
            <button
              className={`settings-toggle${focusMode ? ' settings-toggle--on' : ''}`}
              onClick={toggleFocusMode}
            >
              <span className="settings-toggle__knob" />
            </button>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section__title">🎨 THÈME</div>
          <div className="settings-theme-grid">
            {[
              { id: 'dark', label: 'Dark', desc: 'Sombre — défaut', icon: '🌑' },
              { id: 'light', label: 'Light', desc: 'Beige / Gris clair', icon: '☀️' },
            ].map(t => (
              <button
                key={t.id}
                className={`settings-theme-card${theme === t.id ? ' settings-theme-card--active' : ''}`}
                onClick={() => setTheme(t.id)}
              >
                <span className="settings-theme-card__icon">{t.icon}</span>
                <span className="settings-theme-card__label">{t.label}</span>
                <span className="settings-theme-card__desc">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section__title">📐 DENSITÉ / ESPACEMENT</div>
          <div className="settings-density-grid">
            {[
              { id: 'compact', label: 'Compact' },
              { id: 'normal', label: 'Normal' },
              { id: 'spacious', label: 'Aéré' },
            ].map(d => (
              <button
                key={d.id}
                className={`settings-density-btn${density === d.id ? ' settings-density-btn--active' : ''}`}
                onClick={() => setDensity(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-footer">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>CodeArena — Version Alpha 1.0.2</span>
          <button className="ui-button ui-button--outline ui-button--small" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  )
}
