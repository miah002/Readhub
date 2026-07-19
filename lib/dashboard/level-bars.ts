import type { Learner, Level } from '@/lib/types'

export interface LevelBarDatum {
  level: Level
  count: number
  pct: number
}

const LEVELS: Level[] = ['beginning', 'developing', 'transitioning']

export function computeLevelBars(learners: Learner[]): LevelBarDatum[] {
  const total = learners.length
  return LEVELS.map((level) => {
    const count = learners.filter((l) => l.level === level).length
    return { level, count, pct: total === 0 ? 0 : Math.round((count / total) * 100) }
  })
}
