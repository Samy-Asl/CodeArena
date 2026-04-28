import { useEffect, useState } from 'react'
import Button from '../UI/Button.jsx'
import Visualizer from '../Visualization/Visualizer.jsx'

function ProblemPanel({ disabled, onNextProblem, problem }) {
  const [isChanging, setIsChanging] = useState(false)

  // Trigger transition animation whenever problem changes
  useEffect(() => {
    setIsChanging(true)
    const id = setTimeout(() => setIsChanging(false), 420)
    return () => clearTimeout(id)
  }, [problem.id])

  return (
    <section className={`problem-panel panel${isChanging ? ' problem-panel--changing' : ''}`}>
      <div className="panel__header">
        <span>Problem</span>
        <div className="problem-panel__actions">
          <span className="difficulty">Easy</span>
          <Button
            className="ui-button--small ui-button--secondary"
            disabled={disabled}
            onClick={onNextProblem}
          >
            Next ›
          </Button>
        </div>
      </div>

      <div className="problem-panel__content">
        <h1>{problem.title}</h1>
        <p>{problem.description}</p>

        <div className="examples">
          <h2>Examples</h2>
          {problem.examples.map((example, index) => (
            <div className="example" key={example.input}>
              <h3>Example {index + 1}</h3>
              <pre>Input: {example.input}</pre>
              <pre>Output: {example.output}</pre>
            </div>
          ))}
        </div>

        {/* Per-problem visualization */}
        <Visualizer problemId={problem.id} />
      </div>
    </section>
  )
}

export default ProblemPanel
