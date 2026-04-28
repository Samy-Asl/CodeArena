function Card({ children, className = '' }) {
  return <section className={`ui-card ${className}`.trim()}>{children}</section>
}

export default Card
