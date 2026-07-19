'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { useLanguage } from '@/lib/i18n/language-context'
import { LanguageToggle } from './language-toggle'
import { Button } from './ui/button'

const NAV_LINKS = [
  { href: '/repository', key: 'repository' as const },
  { href: '/profiles', key: 'profiles' as const },
  { href: '/content', key: 'content' as const },
  { href: '/assessments', key: 'assessments' as const },
  { href: '/reports', key: 'reports' as const },
  { href: '/resources', key: 'resources' as const },
]

interface NavHeaderProps {
  loggedIn: boolean
  onLogout: () => void
}

function navClass(active: boolean) {
  return clsx('px-3 py-2 rounded-lg font-display text-sm whitespace-nowrap', active ? 'bg-[#FFE7B8] text-[#B87B12]' : 'text-inkSub')
}

export function NavHeader({ loggedIn, onLogout }: NavHeaderProps) {
  const pathname = usePathname()
  const { dict, lang, setLang } = useLanguage()

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b-2 border-cardBorder">
      <div className="max-w-[1240px] mx-auto px-7 py-3.5 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#FF8A5B] to-coral grid place-items-center text-2xl">📖</span>
          <span className="font-display font-bold text-2xl text-coral">READHub</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 overflow-x-auto">
          <Link href="/" className={navClass(pathname === '/')}>{dict.nav.home}</Link>
          {NAV_LINKS.map((n) => (
            <Link key={n.href} href={n.href} className={navClass(pathname.startsWith(n.href))}>
              {dict.nav[n.key]}
            </Link>
          ))}
          {loggedIn && (
            <Link href="/dashboard" className={navClass(pathname.startsWith('/dashboard'))}>
              {dict.nav.dashboard}
            </Link>
          )}
          {loggedIn && (
            <Link href="/notifications" aria-label="Notifications" className="w-10 h-10 rounded-xl bg-[#FBEFDD] border-2 border-cardBorder grid place-items-center text-lg ml-1 flex-shrink-0">
              🔔
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle lang={lang} onChange={setLang} />
          {loggedIn ? (
            <Button variant="purple" onClick={onLogout}>{dict.header.logout}</Button>
          ) : (
            <Link href="/login">
              <Button variant="teal">{dict.header.login}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
