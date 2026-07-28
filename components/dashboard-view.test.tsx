import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DashboardView } from './dashboard-view'
import { LanguageProvider } from '@/lib/i18n/language-context'
import type { Learner } from '@/lib/types'

const refresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}))

const learners: (Learner & { passageCount: number })[] = [
  { id: '1', teacher_id: 't1', name: 'Maria Santos', grade: 'Grade 2', level: 'developing', progress_pct: 64, avatar_initials: 'MS', passageCount: 8 },
]

function renderDashboard(onAddLearner = vi.fn().mockResolvedValue(undefined)) {
  render(
    <LanguageProvider>
      <DashboardView
        teacherName="Teacher Jemimah Ulan"
        materialsCount={248}
        learnerCount={32}
        weekAssignments={5}
        levelBars={[{ level: 'beginning', count: 8, pct: 25 }, { level: 'developing', count: 15, pct: 47 }, { level: 'transitioning', count: 9, pct: 28 }]}
        learners={learners}
        onAddLearner={onAddLearner}
      />
    </LanguageProvider>
  )
  return onAddLearner
}

describe('DashboardView', () => {
  beforeEach(() => {
    refresh.mockClear()
  })

  it('renders stat counts and the learner list', () => {
    renderDashboard()
    expect(screen.getByText('Teacher Jemimah Ulan 👋')).toBeInTheDocument()
    expect(screen.getByText('248')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('Grade 2 · 8 passages')).toBeInTheDocument()
  })

  it('adds a learner and refreshes the page', async () => {
    const onAddLearner = renderDashboard()
    await userEvent.click(screen.getByRole('button', { name: '+ Add Learner' }))
    await userEvent.type(screen.getByPlaceholderText('Name'), 'Juan Dela Cruz')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAddLearner).toHaveBeenCalledWith({ name: 'Juan Dela Cruz', grade: 'G1', level: 'beginning', avatarInitials: 'JC' })
    expect(refresh).toHaveBeenCalledOnce()
  })
})
