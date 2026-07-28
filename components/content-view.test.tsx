import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ContentView } from './content-view'
import { LanguageProvider } from '@/lib/i18n/language-context'
import type { Passage } from '@/lib/types'

const refresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}))

const existingPassage: Passage = {
  id: 'p1', title: 'My Little Garden', theme: 'Nature', grade: 'G1', level: 'beginning', language: 'EN',
  competency: 'Vocabulary', quarter: 'Q1', minutes: 3, emoji: '🌱', cover_bg: '#DFF6F1',
  body: ['para'], status: 'published', source: 'teacher', created_by: 't1',
}

function renderContent(onCreatePassage = vi.fn().mockResolvedValue(undefined)) {
  render(
    <LanguageProvider>
      <ContentView passages={[existingPassage]} onCreatePassage={onCreatePassage} />
    </LanguageProvider>
  )
  return onCreatePassage
}

describe('ContentView', () => {
  beforeEach(() => {
    refresh.mockClear()
  })

  it('renders the uploads list', () => {
    renderContent()
    expect(screen.getByText('My Little Garden')).toBeInTheDocument()
  })

  it('submits a new passage and refreshes the page', async () => {
    const onCreatePassage = renderContent()
    await userEvent.click(screen.getByRole('button', { name: '+ Upload Material' }))
    await userEvent.type(screen.getByPlaceholderText('Title'), 'Counting Mangoes')
    await userEvent.type(screen.getByPlaceholderText('Theme'), 'Community')
    await userEvent.type(screen.getByPlaceholderText('Passage text (one paragraph per line)'), 'Line one.\nLine two.')
    await userEvent.click(screen.getByRole('button', { name: 'Publish to Repository' }))

    expect(onCreatePassage).toHaveBeenCalledWith({
      title: 'Counting Mangoes',
      theme: 'Community',
      grade: 'G1',
      level: 'beginning',
      language: 'EN',
      competency: 'Vocabulary',
      quarter: 'Q1',
      minutes: 5,
      emoji: '📖',
      coverBg: '#FFE0D8',
      body: ['Line one.', 'Line two.'],
    })
    expect(refresh).toHaveBeenCalledOnce()
  })
})
