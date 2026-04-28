const EXAMPLE_DATA = {
  'two-sum': { nums: [2, 7, 11, 15], target: 9, pairIndices: [0, 1] },
  'max-in-array': { nums: [4, 9, 2, 11, 6], maxIndex: 3 },
  'reverse-array': { original: [1, 2, 3, 4], reversed: [4, 3, 2, 1] },
  'linked-list-length': { nodes: [1, 2, 3] },
}

function TwoSumViz({ data }) {
  const { nums, target, pairIndices } = data
  return (
    <div className="visualizer">
      <p className="visualizer__title">Visualization — Two Sum</p>
      <div className="viz-blocks">
        {nums.map((val, i) => {
          const isPair = pairIndices.includes(i)
          const isFirst = pairIndices[0] === i
          return (
            <div className="viz-block" key={i}>
              <div className={`viz-block__box${isPair ? (isFirst ? ' viz-block__box--highlight' : ' viz-block__box--secondary') : ''}`}>
                {val}
              </div>
              <span className="viz-block__idx">[{i}]</span>
            </div>
          )
        })}
      </div>
      <p className="viz-label">
        nums[{pairIndices[0]}] + nums[{pairIndices[1]}] = {nums[pairIndices[0]]} + {nums[pairIndices[1]]} = <span>{target}</span> ✓
      </p>
    </div>
  )
}

function MaxArrayViz({ data }) {
  const { nums, maxIndex } = data
  const max = nums[maxIndex]
  const maxVal = Math.max(...nums)
  return (
    <div className="visualizer">
      <p className="visualizer__title">Visualization — Max in Array</p>
      <div className="viz-bars">
        {nums.map((val, i) => {
          const heightPct = Math.round((val / maxVal) * 100)
          return (
            <div className="viz-bar-wrap" key={i}>
              <span className="viz-bar__val">{val}</span>
              <div className={`viz-bar${i === maxIndex ? ' viz-bar--max' : ''}`} style={{ height: `${heightPct}%` }} />
            </div>
          )
        })}
      </div>
      <p className="viz-label" style={{ marginTop: 8 }}>Max = <span>{max}</span> at index [{maxIndex}]</p>
    </div>
  )
}

function ReverseArrayViz({ data }) {
  const { original, reversed } = data
  return (
    <div className="visualizer">
      <p className="visualizer__title">Visualization — Reverse Array</p>
      <div className="viz-reverse">
        <div className="viz-row">
          <span className="viz-row-label">Input:</span>
          {original.map((v, i) => <div className="viz-item" key={i}>{v}</div>)}
        </div>
        <div className="viz-row">
          <span className="viz-row-label">Output:</span>
          {reversed.map((v, i) => <div className="viz-item viz-item--reversed" key={i}>{v}</div>)}
        </div>
      </div>
    </div>
  )
}

function LinkedListViz({ data }) {
  const { nodes } = data
  return (
    <div className="visualizer">
      <p className="visualizer__title">Visualization — Linked List</p>
      <div className="viz-linked">
        {nodes.map((val, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="viz-node">
              <div className="viz-node__box">
                <span className="viz-node__val">{val}</span>
                <span className="viz-node__ptr">→</span>
              </div>
              <span className="viz-node__label">node {i + 1}</span>
            </div>
            {i < nodes.length - 1 && <span className="viz-link-arrow">⟶</span>}
          </div>
        ))}
        <span className="viz-link-arrow">⟶</span>
        <span className="viz-null">null</span>
      </div>
      <p className="viz-label">Length = <span>{nodes.length}</span></p>
    </div>
  )
}

function Visualizer({ problemId }) {
  const data = EXAMPLE_DATA[problemId]
  if (!data) return null
  switch (problemId) {
    case 'two-sum': return <TwoSumViz data={data} />
    case 'max-in-array': return <MaxArrayViz data={data} />
    case 'reverse-array': return <ReverseArrayViz data={data} />
    case 'linked-list-length': return <LinkedListViz data={data} />
    default: return null
  }
}

export default Visualizer
