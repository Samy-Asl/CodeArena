export default function TestsPanel({ results, testCases, isRunning }) {
  if (!testCases || testCases.length === 0) return null

  const passed = results.filter(r => r.status === 'pass').length
  const total = testCases.length
  const allPass = passed === total && results.length === total
  const anyFail = results.some(r => r.status !== 'pass') && results.length > 0

  return (
    <div className="panel tests-panel">
      <div className="panel__header">
        <span>&lt;/&gt; TESTS</span>
        {results.length > 0 && (
          <span style={{ fontSize: '0.78rem', color: allPass ? 'var(--green)' : 'var(--red)' }}>
            {passed}/{total} passés
          </span>
        )}
      </div>
      <div className="tests-grid">
        {testCases.map((tc, i) => {
          const res = results[i]
          let cls = 'test-case'
          let icon = <span className="test-case__status test-case__status--pending">⏳</span>
          if (isRunning) { icon = <span className="test-case__status test-case__status--pending" style={{animation:'blink 0.5s infinite'}}>⌛</span> }
          if (res) {
            if (res.status === 'pass') { cls += ' test-case--pass'; icon = <span className="test-case__status test-case__status--pass">✓</span> }
            else { cls += ' test-case--fail'; icon = <span className="test-case__status test-case__status--fail">✗</span> }
          }
          const inputStr = JSON.stringify(tc.input).slice(0, 30)
          const expectedStr = JSON.stringify(tc.expected).slice(0, 20)
          return (
            <div key={i} className={cls}>
              <span className="test-case__title">Test {i + 1}</span>
              <span className="test-case__io">in: {inputStr}</span>
              <span className="test-case__io">exp: {expectedStr}</span>
              {res?.output !== undefined && <span className="test-case__io" style={{ color: res.status === 'pass' ? 'var(--green)' : 'var(--red)' }}>got: {JSON.stringify(res.output).slice(0, 20)}</span>}
              {res?.message && res.status !== 'pass' && <span style={{ fontSize: '0.65rem', color: 'var(--red)' }}>{res.message.slice(0, 40)}</span>}
              {icon}
            </div>
          )
        })}
      </div>
      {results.length > 0 && (
        <div className={`tests-summary${anyFail ? ' tests-summary--fail' : ''}`}>
          <span className="tests-summary__icon">{allPass ? '✅' : '❌'}</span>
          <div>
            <div className={`tests-summary__label${allPass ? ' tests-summary__label--pass' : ' tests-summary__label--fail'}`}>
              {allPass ? 'TOUS LES TESTS RÉUSSIS !' : `${passed}/${total} TESTS PASSÉS`}
            </div>
            <div className="tests-summary__sub">
              {allPass ? 'Solution acceptée 🎉' : `${total - passed} test(s) échoué(s)`}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
