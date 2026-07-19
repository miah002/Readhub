'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { en } from './en'
import { fil } from './fil'
import type { Dictionary } from './dictionary'

type LangCode = 'en' | 'fil'

interface LanguageContextValue {
  lang: LangCode
  dict: Dictionary
  setLang: (lang: LangCode) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const DICTS: Record<LangCode, Dictionary> = { en, fil }

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>('en')
  return (
    <LanguageContext.Provider value={{ lang, dict: DICTS[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
