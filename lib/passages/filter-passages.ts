import type { Passage, Level, Language } from '@/lib/types'

export interface PassageFilters {
  grade: string
  level: Level | 'all'
  language: Language | 'all'
  competency: string
  quarter: string
}

export const DEFAULT_FILTERS: PassageFilters = { grade: 'all', level: 'all', language: 'all', competency: 'all', quarter: 'all' }

export function filterPassages(passages: Passage[], filters: PassageFilters): Passage[] {
  return passages.filter((p) =>
    (filters.grade === 'all' || p.grade === filters.grade) &&
    (filters.level === 'all' || p.level === filters.level) &&
    (filters.language === 'all' || p.language === filters.language) &&
    (filters.competency === 'all' || p.competency === filters.competency) &&
    (filters.quarter === 'all' || p.quarter === filters.quarter)
  )
}
