'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface LoginViewProps {
  onSubmit: (email: string, password: string) => Promise<{ error?: string } | void>
}

export function LoginView({ onSubmit }: LoginViewProps) {
  const { dict } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const result = await onSubmit(email, password)
    if (result?.error) setError(result.error)
    setSubmitting(false)
  }

  return (
    <main className="max-w-[460px] mx-auto mt-16 mb-24 px-7">
      <Card>
        <div className="text-center mb-6">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-[#FF8A5B] to-coral grid place-items-center text-3xl mx-auto mb-4">📖</div>
          <h1 className="font-display font-bold text-2xl">{dict.login.title}</h1>
          <p className="text-sm text-inkSub mt-2">{dict.login.subtitle}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-xs font-extrabold text-inkMuted">{dict.login.emailLabel}</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1.5 px-4 py-3 rounded-xl border-2 border-cardBorder text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-extrabold text-inkMuted">{dict.login.passwordLabel}</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1.5 px-4 py-3 rounded-xl border-2 border-cardBorder text-sm"
            />
          </div>
          {error && <p role="alert" className="text-coral text-sm font-bold">{error}</p>}
          <Button type="submit" disabled={submitting}>{dict.login.loginBtn}</Button>
          <a href="#" className="text-center text-sm font-extrabold">{dict.login.forgot}</a>
        </form>
      </Card>
      <div className="text-center mt-6">
        <Link href="/" className="text-sm font-extrabold">{dict.login.backHome}</Link>
      </div>
    </main>
  )
}
