import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DashboardView } from './dashboard-view'
import { en } from '@/lib/i18n/en'
import type { Learner } from '@/lib/types'

const learners: (Learner & { passageCount: number })[] = [
  { id: '1', teacher_id: 't1', name: 'Maria Santos', grade: 'Grade 2', level: 'developing', progress_pct: 64, avatar_initials: 'MS', passageCount: 8 },
]

describe('DashboardView', () => {
  it('renders stat counts and the learner list', () => {
    render(
      <DashboardView
        dict={en}
        teacherName="Teacher Jemimah Ulan"
        materialsCount={248}
        learnerCount={32}
        weekAssignments={5}
        levelBars={[{ level: 'beginning', count: 8, pct: 25 }, { level: 'developing', count: 15, pct: 47 }, { level: 'transitioning', count: 9, pct: 28 }]}
        learners={learners}
      />
    )
    expect(screen.getByText('Teacher Jemimah Ulan 👋')).toBeInTheDocument()
    expect(screen.getByText('248')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('Grade 2 · 8 passages')).toBeInTheDocument()
  })
})
