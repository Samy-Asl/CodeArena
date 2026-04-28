import { createContext, useContext, useState } from 'react'
import { problems } from '../data/problems.js'

const DuelContext = createContext(null)

export const languages = ['JavaScript', 'Python', 'C']

function getRandomProblem(currentId) {
  const availableProblems = problems.filter((problem) => problem.id !== currentId)
  const nextIndex = Math.floor(Math.random() * availableProblems.length)

  return availableProblems[nextIndex] || problems[0]
}

export function DuelProvider({ children }) {
  const [currentProblem, setCurrentProblem] = useState(problems[0])
  const [language, setLanguage] = useState(languages[0])

  function nextProblem() {
    setCurrentProblem((problem) => getRandomProblem(problem.id))
  }

  return (
    <DuelContext.Provider
      value={{
        currentProblem,
        language,
        setLanguage,
        nextProblem,
      }}
    >
      {children}
    </DuelContext.Provider>
  )
}

export function useDuel() {
  const context = useContext(DuelContext)

  if (!context) {
    throw new Error('useDuel must be used inside DuelProvider')
  }

  return context
}
