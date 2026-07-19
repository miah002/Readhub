import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { RepositoryView } from './repository-view'
import { LanguageProvider } from '@/lib/i18n/language-context'
import type { Passage } from '@/lib/types'

function passage(overrides: Partial<Passage>): Passage {
  return {
    id: '1', title: 'My Little Garden', theme: 'Nature', grade: 'G1', level: 'beginning', language: 'EN',
    competency: 'Vocabulary', quarter: 'Q1', minutes: 3, emoji: '🌱', cover_bg: '#DFF6F1',
    body: ['para'], status: 'published', source: 'teacher', created_by: 't1', ...overrides,
  }
}

const passages: Passage[] = [
  passage({ id: '1', title: 'My Little Garden', grade: 'G1' }),
  passage({ id: '2', title: 'Volcano Mysteries', grade: 'G4', level: 'transitioning' }),
]

describe('RepositoryView', () => {
  it('filters the grid when a grade chip is clicked', async () => {
    render(<LanguageProvider><RepositoryView passages={passages} /></LanguageProvider>)
    expect(screen.getByText('2 passages found')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'G1' }))
    expect(screen.getByText('1 passages found')).toBeInTheDocument()
    expect(screen.getByText('My Little Garden')).toBeInTheDocument()
    expect(screen.queryByText('Volcano Mysteries')).not.toBeInTheDocument()
  })

  it('shows the empty state when no passage matches', async () => {
    render(<LanguageProvider><RepositoryView passages={passages} /></LanguageProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'G6' }))
    expect(screen.getByText('No passages match those filters yet.')).toBeInTheDocument()
  })
})
