import { describe, it, expect } from 'vitest'
import { filterPassages, DEFAULT_FILTERS } from './filter-passages'
import type { Passage } from '@/lib/types'

function passage(overrides: Partial<Passage>): Passage {
  return {
    id: '1', title: 'Test', theme: 'Nature', grade: 'G1', level: 'beginning', language: 'EN',
    competency: 'Vocabulary', quarter: 'Q1', minutes: 3, emoji: '🌱', cover_bg: '', body: [],
    status: 'published', source: 'teacher', created_by: 't1', ...overrides,
  }
}

const passages: Passage[] = [
  passage({ id: '1', grade: 'G1', level: 'beginning', language: 'EN', competency: 'Vocabulary', quarter: 'Q1' }),
  passage({ id: '2', grade: 'G2', level: 'developing', language: 'FIL', competency: 'Comprehension', quarter: 'Q2' }),
  passage({ id: '3', grade: 'G1', level: 'transitioning', language: 'EN', competency: 'Fluency', quarter: 'Q3' }),
]

describe('filterPassages', () => {
  it('returns everything when all filters are "all"', () => {
    expect(filterPassages(passages, DEFAULT_FILTERS)).toHaveLength(3)
  })

  it('combines filters with AND logic', () => {
    const result = filterPassages(passages, { ...DEFAULT_FILTERS, grade: 'G1', level: 'beginning' })
    expect(result.map((p) => p.id)).toEqual(['1'])
  })

  it('returns an empty array when no passage matches', () => {
    const result = filterPassages(passages, { ...DEFAULT_FILTERS, grade: 'G6' })
    expect(result).toEqual([])
  })
})
