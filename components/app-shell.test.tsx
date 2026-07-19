import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppShell } from './app-shell'
import { LanguageProvider } from '@/lib/i18n/language-context'

const push = vi.fn()
const refresh = vi.fn()
const signOut = vi.fn().mockResolvedValue({ error: null })

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push, refresh }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { signOut } }),
}))

describe('AppShell', () => {
  beforeEach(() => {
    push.mockClear()
    refresh.mockClear()
    signOut.mockClear()
  })

  it('signs out and redirects home when Log Out is clicked', async () => {
    render(
      <LanguageProvider>
        <AppShell loggedIn={true}>content</AppShell>
      </LanguageProvider>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Log Out' }))
    expect(signOut).toHaveBeenCalledOnce()
    expect(push).toHaveBeenCalledWith('/')
    expect(refresh).toHaveBeenCalledOnce()
  })
})
