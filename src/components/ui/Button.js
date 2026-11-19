export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variantClass = variant === 'danger' ? 'danger' : variant === 'secondary' ? '' : 'primary';
  return <button className={`${variantClass} ${className}`.trim()} {...props}>{children}</button>;
}
