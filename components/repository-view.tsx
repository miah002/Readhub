'use client'
import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { useLanguage } from '@/lib/i18n/language-context'
import { LevelBadge } from './ui/level-badge'
import { filterPassages, DEFAULT_FILTERS, type PassageFilters } from '@/lib/passages/filter-passages'
import { LEVEL_COLOR } from '@/lib/level-colors'
import type { Passage, Level } from '@/lib/types'

interface RepositoryViewProps {
  passages: Passage[]
}

function Chip({ active, onClick, children, dot }: { active: boolean; onClick: () => void; children: ReactNode; dot?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold border-2',
        active ? 'bg-ink text-white border-ink' : 'bg-cardAlt text-inkSub border-cardBorder'
      )}
    >
      {dot && <span className="w-2.5 h-2.5 rounded-sm" style={{ background: dot }} />}
      {children}
    </button>
  )
}

const GRADES = ['all', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6']
const LEVELS: { value: Level | 'all'; color: string }[] = [
  { value: 'all', color: '#B7AE9C' },
  { value: 'beginning', color: LEVEL_COLOR.beginning },
  { value: 'developing', color: LEVEL_COLOR.developing },
  { value: 'transitioning', color: LEVEL_COLOR.transitioning },
]
const COMPETENCIES = ['all', 'Vocabulary', 'Comprehension', 'Fluency']
const QUARTERS = ['all', 'Q1', 'Q2', 'Q3', 'Q4']
const LANGUAGES: { value: 'all' | 'EN' | 'FIL'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'EN', label: 'English' },
  { value: 'FIL', label: 'Filipino' },
]

export function RepositoryView({ passages }: RepositoryViewProps) {
  const { dict } = useLanguage()
  const [filters, setFilters] = useState<PassageFilters>(DEFAULT_FILTERS)
  const visible = filterPassages(passages, filters)

  return (
    <main className="max-w-[1240px] mx-auto px-7 py-9">
      <div className="mb-6">
        <h1 className="font-display font-bold text-4xl">📚 {dict.repository.title}</h1>
        <p className="text-inkSub mt-1.5">{dict.repository.subtitle}</p>
      </div>
      <div className="grid grid-cols-[250px_1fr] gap-6 items-start">
        <aside className="bg-white border-2 border-cardBorder rounded-[22px] p-5 sticky top-24">
          <div className="font-display font-semibold mb-3">🔎 {dict.repository.filters}</div>

          <div className="text-xs font-extrabold text-inkMuted uppercase mb-2.5">{dict.repository.gradeLevel}</div>
          <div className="flex flex-wrap gap-2 mb-5">
            {GRADES.map((g) => (
              <Chip key={g} active={filters.grade === g} onClick={() => setFilters((f) => ({ ...f, grade: g }))}>
                {g === 'all' ? dict.levels.all : g}
              </Chip>
            ))}
          </div>

          <div className="text-xs font-extrabold text-inkMuted uppercase mb-2.5">{dict.repository.readingLevel}</div>
          <div className="flex flex-col gap-2 mb-5">
            {LEVELS.map((l) => (
              <Chip key={l.value} active={filters.level === l.value} onClick={() => setFilters((f) => ({ ...f, level: l.value }))} dot={l.color}>
                {l.value === 'all' ? dict.levels.all : dict.levels[l.value]}
              </Chip>
            ))}
          </div>

          <div className="text-xs font-extrabold text-inkMuted uppercase mb-2.5">{dict.repository.competency}</div>
          <div className="flex flex-wrap gap-2 mb-5">
            {COMPETENCIES.map((c) => (
              <Chip key={c} active={filters.competency === c} onClick={() => setFilters((f) => ({ ...f, competency: c }))}>
                {c === 'all' ? dict.levels.all : c}
              </Chip>
            ))}
          </div>

          <div className="text-xs font-extrabold text-inkMuted uppercase mb-2.5">{dict.repository.quarter}</div>
          <div className="flex flex-wrap gap-2 mb-5">
            {QUARTERS.map((q) => (
              <Chip key={q} active={filters.quarter === q} onClick={() => setFilters((f) => ({ ...f, quarter: q }))}>
                {q === 'all' ? dict.levels.all : q}
              </Chip>
            ))}
          </div>

          <div className="text-xs font-extrabold text-inkMuted uppercase mb-2.5">{dict.repository.language}</div>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <Chip key={l.value} active={filters.language === l.value} onClick={() => setFilters((f) => ({ ...f, language: l.value }))}>
                {l.value === 'all' ? dict.levels.all : l.label}
              </Chip>
            ))}
          </div>
        </aside>

        <div>
          <div className="font-extrabold text-sm text-inkMuted mb-4">{visible.length} {dict.repository.passagesFound}</div>
          <div className="grid grid-cols-3 gap-[18px]">
            {visible.map((p) => (
              <Link key={p.id} href={`/repository/${p.id}`} className="bg-white border-2 border-cardBorder rounded-[20px] overflow-hidden flex flex-col">
                <div className="h-[120px] grid place-items-center text-5xl relative" style={{ background: p.cover_bg }}>
                  {p.emoji}
                  <span className="absolute top-2.5 left-2.5 text-xs font-extrabold bg-white/85 px-2.5 py-1 rounded-full">{p.grade}</span>
                  <span className="absolute top-2.5 right-2.5 text-xs font-extrabold text-white bg-ink/55 px-2.5 py-1 rounded-full">{p.language}</span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="font-display font-semibold text-lg leading-tight">{p.title}</div>
                  <div className="text-xs text-inkMuted font-bold mt-1">{p.theme} · {p.minutes} min</div>
                  <div className="text-[11.5px] text-inkMuted font-bold mt-0.5">{p.competency} · {p.quarter}</div>
                  <div className="mt-auto pt-3.5 flex items-center justify-between">
                    <LevelBadge level={p.level} label={dict.levels[p.level]} />
                    <span className="font-display font-semibold text-sm text-coral">{dict.repository.assign} →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {visible.length === 0 && (
            <div className="text-center py-16 text-inkMuted">
              <div className="text-5xl">🫙</div>
              <div className="font-display font-semibold text-xl mt-3">{dict.repository.noResults}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
