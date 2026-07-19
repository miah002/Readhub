'use client'
import { useRouter } from 'next/navigation'
import { NavHeader } from './nav-header'
import { Footer } from './footer'
import { createClient } from '@/lib/supabase/client'
import type { ReactNode } from 'react'

export function AppShell({ loggedIn, children }: { loggedIn: boolean; children: ReactNode }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavHeader loggedIn={loggedIn} onLogout={handleLogout} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
