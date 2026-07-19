'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/language-context'

export function Footer() {
  const { dict } = useLanguage()
  return (
    <footer className="border-t-2 border-cardBorder mt-5">
      <div className="max-w-[1240px] mx-auto px-7 py-6 flex items-center gap-3 flex-wrap text-inkMuted font-bold text-sm">
        <span className="font-display text-coral text-base">READHub</span>
        <span>&middot; San Joaquin Elementary School</span>
        <Link href="/admin" className="text-inkMuted font-bold">Admin Panel</Link>
        <span className="ml-auto">{dict.footer}</span>
      </div>
    </footer>
  )
}
