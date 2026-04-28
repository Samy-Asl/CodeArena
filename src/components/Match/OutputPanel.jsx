import { useEffect, useState } from 'react'
import Button from '../UI/Button.jsx'

function OutputPanel({ isLoading, result, onRun }) {
  // Key to re-trigger enter animation on each new result
  const [resultKey, setResultKey] = useState(0)

  useEffect(() => {
    if (result) {
      setResultKey((k) => k + 1)
    }
  }, [result])

  const resultClass = {
    Correct: 'console-result--correct',
    Wrong: 'console-result--wrong',
    'Time limit': 'console-result--timeout',
  }[result]

  return (
    <section className="output-panel panel">
      <div className="panel__header">
        <span>Output</span>
        <Button
          className={`ui-button--small${isLoading ? ' ui-button--run-active' : ''}`}
          disabled={isLoading}
          onClick={onRun}
        >
          {isLoading ? '⏳ Running…' : '▶ Run'}
        </Button>
      </div>

      <div className="console-box">
        {isLoading ? (
          <span className="console-result console-result--loading">
            Running test cases…
          </span>
        ) : result ? (
          <span
            key={resultKey}
            className={`console-result ${resultClass} console-result-enter`}
          >
            {result === 'Correct' && '✓ '}
            {result === 'Wrong' && '✗ '}
            {result === 'Time limit' && '⏱ '}
            {result}
          </span>
        ) : (
          <span className="console-placeholder">
            Press Run to execute your code against the test cases.
          </span>
        )}
      </div>
    </section>
  )
}

export default OutputPanel
