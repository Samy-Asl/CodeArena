import { useCallback, useState } from 'react'

export function useTestRunner() {
  const [results, setResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = useCallback((code, testCases, fnName) => {
    setIsRunning(true)
    setResults([])

    // FIX: previously wrapped code in (...; IIFE) causing SyntaxError with ";".
    // Now: declare function as a statement, then return IIFE result.
    const workerCode = `
self.onmessage = function(e) {
  const { code, testCases, fnName } = e.data
  const results = []
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i]
    const start = Date.now()
    try {
      const runner = code + '\\n;return (function(){' +
        'var __args = ' + JSON.stringify(tc.input) + ';' +
        'return JSON.stringify(' + fnName + '.apply(null,__args));' +
        '})();'
      const rawResult = Function('"use strict"; ' + runner)()
      const elapsed = Date.now() - start
      let output
      try { output = JSON.parse(rawResult) } catch { output = rawResult }
      const expected = tc.expected
      const pass = JSON.stringify(output) === JSON.stringify(expected)
      results.push({ index:i, status: pass?'pass':'fail', output, expected, elapsed,
        message: pass ? null : 'Obtenu: ' + JSON.stringify(output) + ' | Attendu: ' + JSON.stringify(expected) })
    } catch(err) {
      results.push({ index:i, status:'error', message: err.message||String(err), elapsed: Date.now()-start })
    }
  }
  self.postMessage({ type:'done', results })
}
`
    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)

    const timeout = setTimeout(() => {
      worker.terminate()
      URL.revokeObjectURL(url)
      setIsRunning(false)
      setResults(testCases.map((_, i) => ({ index: i, status: 'tle', message: 'Temps limite depassé (3s)', elapsed: 3000 })))
    }, 3000)

    worker.onmessage = (e) => {
      clearTimeout(timeout)
      worker.terminate()
      URL.revokeObjectURL(url)
      setResults(e.data.results)
      setIsRunning(false)
    }

    worker.onerror = (err) => {
      clearTimeout(timeout)
      worker.terminate()
      URL.revokeObjectURL(url)
      setResults(testCases.map((_, i) => ({ index: i, status: 'error', message: err.message || 'Erreur inconnue' })))
      setIsRunning(false)
    }

    worker.postMessage({ code, testCases, fnName })
  }, [])

  const reset = useCallback(() => { setResults([]); setIsRunning(false) }, [])

  return { results, isRunning, runTests, reset }
}
