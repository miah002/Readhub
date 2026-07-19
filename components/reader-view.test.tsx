import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ReaderView } from './reader-view'
import { LanguageProvider } from '@/lib/i18n/language-context'
import type { Passage, Learner } from '@/lib/types'

const passage: Passage = {
  id: 'p1', title: 'My Little Garden', theme: 'Nature', grade: 'G1', level: 'beginning', language: 'EN',
  competency: 'Vocabulary', quarter: 'Q1', minutes: 3, emoji: '🌱', cover_bg: '#DFF6F1',
  body: ['Lina has a small garden.'], status: 'published', source: 'teacher', created_by: 't1',
}

const learners: Learner[] = [
  { id: 'l1', teacher_id: 't1', name: 'Maria Santos', grade: 'Grade 2', level: 'developing', progress_pct: 64, avatar_initials: 'MS' },
]

describe('ReaderView', () => {
  it('assigns the passage to selected learners and shows a confirmation banner', async () => {
    const onConfirmAssign = vi.fn().mockResolvedValue(undefined)
    render(<LanguageProvider><ReaderView passage={passage} learners={learners} onConfirmAssign={onConfirmAssign} /></LanguageProvider>)

    await userEvent.click(screen.getByRole('button', { name: 'Assign' }))
    await userEvent.click(screen.getByRole('button', { name: 'Maria Santos' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirm Assignment' }))

    expect(onConfirmAssign).toHaveBeenCalledWith(['l1'])
    expect(await screen.findByText('Assigned to Maria Santos')).toBeInTheDocument()
  })
})
