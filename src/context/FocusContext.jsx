import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const FocusContext = createContext(null)

export function FocusProvider({ children }) {
  const [focusMode, setFocusMode] = useState(false)
  const [theme, setTheme] = useState('dark') // 'dark' | 'light'
  const [density, setDensity] = useState('normal') // 'compact' | 'normal' | 'spacious'

  const toggleFocusMode = useCallback(() => {
    setFocusMode(prev => {
      const next = !prev
      document.body.classList.toggle('focus-mode', next)
      return next
    })
  }, [])

  const setThemeValue = useCallback((t) => {
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  const setDensityValue = useCallback((d) => {
    setDensity(d)
    document.documentElement.setAttribute('data-density', d)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.setAttribute('data-density', 'normal')
    return () => document.body.classList.remove('focus-mode')
  }, [])

  return (
    <FocusContext.Provider value={{ focusMode, toggleFocusMode, theme, setTheme: setThemeValue, density, setDensity: setDensityValue }}>
      {children}
    </FocusContext.Provider>
  )
}

export function useFocus() {
  const ctx = useContext(FocusContext)
  if (!ctx) throw new Error('useFocus must be inside FocusProvider')
  return ctx
}
