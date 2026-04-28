import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const AVATARS = ['#7C3AED','#EC4899','#3B82F6','#22D3EE','#22C55E','#F59E0B']

function makeInitials(pseudo) {
  return pseudo.slice(0,2).toUpperCase()
}

function getStorage() {
  try {
    const raw = localStorage.getItem('codearena_user')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function setStorage(data) {
  try { localStorage.setItem('codearena_user', JSON.stringify(data)) } catch {}
}

function getSolvedStorage() {
  try {
    const raw = localStorage.getItem('codearena_solved')
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function getActivityStorage() {
  try {
    const raw = localStorage.getItem('codearena_activity')
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStorage())
  const [solved, setSolved] = useState(() => getSolvedStorage())
  const [activity, setActivity] = useState(() => getActivityStorage())

  useEffect(() => { setStorage(user) }, [user])

  const login = useCallback((pseudo) => {
    const colorIdx = Math.floor(Math.random() * AVATARS.length)
    const newUser = {
      pseudo,
      avatarColor: AVATARS[colorIdx],
      initials: makeInitials(pseudo),
      level: 1,
      elo: 1200,
      rank: 'Silver II',
      wins: 0,
      losses: 0,
      streak: 0,
      lastActive: new Date().toISOString().slice(0,10),
    }
    setUser(newUser)
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const markSolved = useCallback((problemId) => {
    setSolved(prev => {
      const next = { ...prev, [problemId]: true }
      try { localStorage.setItem('codearena_solved', JSON.stringify(next)) } catch {}
      return next
    })
    const today = new Date().toISOString().slice(0,10)
    setActivity(prev => {
      const next = { ...prev, [today]: (prev[today] || 0) + 1 }
      try { localStorage.setItem('codearena_activity', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const updateElo = useCallback((delta) => {
    setUser(prev => {
      if (!prev) return prev
      const next = { ...prev, elo: prev.elo + delta, wins: delta > 0 ? prev.wins+1 : prev.wins, losses: delta < 0 ? prev.losses+1 : prev.losses }
      setStorage(next)
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, solved, markSolved, updateElo, activity }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
