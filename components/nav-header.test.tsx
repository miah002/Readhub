import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NavHeader } from './nav-header'
import { LanguageProvider } from '@/lib/i18n/language-context'

vi.mock('next/navigation', () => ({ usePathname: () => '/repository' }))

describe('NavHeader', () => {
  it('shows Teacher Login when logged out', () => {
    render(
      <LanguageProvider>
        <NavHeader loggedIn={false} onLogout={vi.fn()} />
      </LanguageProvider>
    )
    expect(screen.getByRole('link', { name: /Teacher Login/ })).toBeInTheDocument()
  })

  it('shows Log Out when logged in and highlights the active nav item', () => {
    render(
      <LanguageProvider>
        <NavHeader loggedIn={true} onLogout={vi.fn()} />
      </LanguageProvider>
    )
    expect(screen.getByRole('button', { name: 'Log Out' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Repository' })).toHaveClass('bg-[#FFE7B8]')
  })
})
