function PrimaryButton({ href, children }) {
  return (
    <a className="primary-button" href={href}>
      <span>{children}</span>
      <span className="primary-button__arrow" aria-hidden="true">↘</span>
    </a>
  )
}

export default PrimaryButton
