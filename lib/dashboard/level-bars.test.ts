import { describe, it, expect } from 'vitest'
import { computeLevelBars } from './level-bars'
import type { Learner } from '@/lib/types'

function learner(level: Learner['level']): Learner {
  return { id: level, teacher_id: 't1', name: level, grade: 'G1', level, progress_pct: 0, avatar_initials: 'XX' }
}

describe('computeLevelBars', () => {
  it('counts and percentages learners per level', () => {
    const learners = [learner('beginning'), learner('developing'), learner('developing'), learner('transitioning')]
    const bars = computeLevelBars(learners)
    expect(bars).toEqual([
      { level: 'beginning', count: 1, pct: 25 },
      { level: 'developing', count: 2, pct: 50 },
      { level: 'transitioning', count: 1, pct: 25 },
    ])
  })

  it('returns 0% for every level when there are no learners', () => {
    expect(computeLevelBars([])).toEqual([
      { level: 'beginning', count: 0, pct: 0 },
      { level: 'developing', count: 0, pct: 0 },
      { level: 'transitioning', count: 0, pct: 0 },
    ])
  })
})
