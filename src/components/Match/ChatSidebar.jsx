import { useState } from 'react'

const SPECTATORS = [
  { pseudo: 'AlgoKing', color: '#7C3AED', initials: 'AK' },
  { pseudo: 'ByteNinja', color: '#EC4899', initials: 'BN' },
  { pseudo: 'CodeWitch', color: '#22D3EE', initials: 'CW' },
  { pseudo: 'Hackerz0', color: '#22C55E', initials: 'HZ' },
  { pseudo: 'DeltaX', color: '#F59E0B', initials: 'DX' },
]

const INIT_MESSAGES = [
  { pseudo: 'AlgoKing', color: '#7C3AED', initials: 'AK', time: '12:34', text: 'GG CodeNinja 🔥', reactions: '👍 12' },
  { pseudo: 'ByteNinja', color: '#EC4899', initials: 'BN', time: '12:35', text: 'DevMaster va gagner facile', reactions: '😂 5' },
  { pseudo: 'CodeWitch', color: '#22D3EE', initials: 'CW', time: '12:36', text: 'c\'est chaud ce problème', reactions: '🔥 8' },
]

export default function ChatSidebar() {
  const [messages, setMessages] = useState(INIT_MESSAGES)
  const [input, setInput] = useState('')

  function sendMsg() {
    if (!input.trim()) return
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`
    setMessages(prev => [...prev, { pseudo: 'Toi', color: '#7C3AED', initials: 'TO', time, text: input, reactions: '' }])
    setInput('')
  }

  return (
    <div className="chat-sidebar">
      {/* Spectators */}
      <div className="spectators-panel">
        <div className="spectators-header">
          <span>SPECTATEURS</span>
          <span className="spectators-count">128 👁</span>
        </div>
        {SPECTATORS.map(s => (
          <div key={s.pseudo} className="spectator-item">
            <div className="spectator-avatar" style={{ background: s.color }}>{s.initials}</div>
            <span className="spectator-name">{s.pseudo}</span>
            <span className="spectator-online" style={{ marginLeft: 'auto' }}>● En ligne</span>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="chat-panel">
        <div className="chat-header">CHAT DUEL</div>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className="chat-message">
              <div className="chat-message__avatar" style={{ background: m.color }}>{m.initials}</div>
              <div className="chat-message__body">
                <div className="chat-message__meta">
                  <span className="chat-message__pseudo">{m.pseudo}</span>
                  <span className="chat-message__time">{m.time}</span>
                </div>
                <div className="chat-message__text">{m.text}</div>
                {m.reactions && <div className="chat-message__reactions">{m.reactions}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg()}
            placeholder="Écrire un message…"
          />
          <button className="chat-send-btn" onClick={sendMsg}>▶</button>
        </div>
      </div>
    </div>
  )
}
