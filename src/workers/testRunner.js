// Web Worker for running JS test cases
self.onmessage = function(e) {
  const { code, testCases, fnName, timeoutMs = 3000 } = e.data
  const results = []

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i]
    const start = Date.now()
    try {
      // Build runner code
      const runner = `
${code}
(function() {
  try {
    const __args = ${JSON.stringify(tc.input)};
    const __result = ${fnName}(...__args);
    return JSON.stringify(__result);
  } catch(e) {
    return JSON.stringify({ __error: e.message });
  }
})()
`
      // eslint-disable-next-line no-new-func
      const rawResult = Function('"use strict"; return (' + runner + ')')()
      const elapsed = Date.now() - start

      if (elapsed > timeoutMs) {
        results.push({ index: i, status: 'tle', message: 'Time Limit Exceeded', elapsed })
        continue
      }

      let output
      try { output = JSON.parse(rawResult) } catch { output = rawResult }

      const expected = tc.expected
      const pass = JSON.stringify(output) === JSON.stringify(expected)

      results.push({
        index: i,
        status: pass ? 'pass' : 'fail',
        output,
        expected,
        elapsed,
        message: pass ? null : `Got: ${JSON.stringify(output)}, Expected: ${JSON.stringify(expected)}`,
      })
    } catch (err) {
      results.push({
        index: i,
        status: 'error',
        message: err.message || String(err),
        elapsed: Date.now() - start,
      })
    }
  }

  self.postMessage({ type: 'done', results })
}
