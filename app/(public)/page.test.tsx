import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from './page'
import { LanguageProvider } from '@/lib/i18n/language-context'

describe('HomePage', () => {
  it('renders the hero and links to Repository and Login', () => {
    render(
      <LanguageProvider>
        <HomePage />
      </LanguageProvider>
    )
    expect(screen.getByText('Differentiated reading support for every struggling reader.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse Reading' })).toHaveAttribute('href', '/repository')
    expect(screen.getByRole('link', { name: 'Teacher Login' })).toHaveAttribute('href', '/login')
  })
})
