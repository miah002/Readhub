'use client'
import { clsx } from 'clsx'

interface LanguageToggleProps {
  lang: 'en' | 'fil'
  onChange: (lang: 'en' | 'fil') => void
}

export function LanguageToggle({ lang, onChange }: LanguageToggleProps) {
  return (
    <div className="flex bg-[#FBEFDD] rounded-full p-1 border-2 border-cardBorder">
      <button
        type="button"
        onClick={() => onChange('en')}
        className={clsx('px-3.5 py-1.5 rounded-full text-sm font-extrabold', lang === 'en' ? 'bg-coral text-white' : 'text-inkMuted')}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange('fil')}
        className={clsx('px-3.5 py-1.5 rounded-full text-sm font-extrabold', lang === 'fil' ? 'bg-coral text-white' : 'text-inkMuted')}
      >
        FIL
      </button>
    </div>
  )
}
