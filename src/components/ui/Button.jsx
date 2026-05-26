import clsx from 'clsx'

export default function Button({ children, variant = 'primary', className, ...props }) {
  return (
    <button
      className={clsx(
        variant === 'primary' && 'btn-primary',
        variant === 'outline' && 'btn-outline',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
