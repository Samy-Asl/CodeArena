function Button({ children, className = '', type = 'button', ...props }) {
  return (
    <button type={type} className={`ui-button ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

export default Button
