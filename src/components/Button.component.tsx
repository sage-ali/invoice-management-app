type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'danger' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: ButtonVariant
  fullWidth?: boolean
  icon?: React.ReactNode
}

export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  icon,
  className = '',
  ...props
}: ButtonProps) => {
  // Using the colors we defined in your tailwind.config.js earlier
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-white hover:bg-primary-hover',

    // "Edit" Button (Button 3) - Handles both Light and Dark mode
    secondary:
      'bg-neutral-100 text-neutral-400 hover:bg-neutral-200 dark:bg-dark-hover dark:text-neutral-200 dark:hover:bg-white dark:hover:text-dark-text',

    // "Save as Draft" Button (Button 4)
    dark: 'bg-dark-surface text-neutral-300 hover:bg-dark-text dark:hover:bg-dark-surface',

    // "Delete" Button (Button 5)
    danger: 'bg-danger text-white hover:bg-danger-hover',

    // "+ Add New Item" Button (Button 6)
    ghost:
      'bg-neutral-100 text-neutral-400 hover:bg-neutral-200 dark:bg-dark-surface dark:text-neutral-200 dark:hover:bg-dark-hover',
  }

  const baseStyles =
    'inline-flex items-center justify-center rounded-full text-heading-s-alt font-bold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

  // Padding changes slightly if there is an icon
  const paddingStyles = icon ? 'py-2 pr-4 pl-2' : 'py-4 px-6'
  const widthStyles = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${paddingStyles} ${widthStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && (
        <span className="text-primary mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-white">
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}
