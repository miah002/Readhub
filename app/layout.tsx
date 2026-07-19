import type { Metadata } from 'next'
import { Fredoka, Nunito } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n/language-context'
import { AppShell } from '@/components/app-shell'
import { createClient } from '@/lib/supabase/server'

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-fredoka' })
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800'], style: ['normal', 'italic'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'READHub',
  description: 'Reading Enhancement through AI-Assisted Digital Hub',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${nunito.variable} font-sans bg-cream text-ink`}>
        <LanguageProvider>
          <AppShell loggedIn={!!user}>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  )
}
