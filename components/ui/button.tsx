import { type ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'teal' | 'purple'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-coral text-white shadow-[0_4px_0_#C13A28]',
  secondary: 'bg-white text-ink border-2 border-cardBorder',
  ghost: 'bg-transparent text-inkMuted',
  teal: 'bg-teal text-white shadow-[0_4px_0_#1B8577]',
  purple: 'bg-purple text-white shadow-[0_4px_0_#5A4DC0]',
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx('rounded-2xl px-6 py-3 font-display font-semibold cursor-pointer', VARIANT_CLASSES[variant], className)}
      {...props}
    />
  )
}
