'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from './ui/card'
import { LevelBadge } from './ui/level-badge'
import { Button } from './ui/button'
import { useLanguage } from '@/lib/i18n/language-context'
import { LEVEL_COLOR } from '@/lib/level-colors'
import type { AddLearnerInput } from '@/lib/supabase/actions'
import type { Learner, Level } from '@/lib/types'
import type { LevelBarDatum } from '@/lib/dashboard/level-bars'

interface DashboardViewProps {
  teacherName: string
  materialsCount: number
  learnerCount: number
  weekAssignments: number
  levelBars: LevelBarDatum[]
  learners: (Learner & { passageCount: number })[]
  onAddLearner: (input: AddLearnerInput) => Promise<{ error?: string } | void>
}

const GRADES = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6']
const LEVELS: Level[] = ['beginning', 'developing', 'transitioning']

const COPY = {
  en: { addLearner: '+ Add Learner', name: 'Name', grade: 'Grade', level: 'Level', add: 'Add', cancel: 'Cancel', noLearners: 'No learners yet — add your first one.' },
  fil: { addLearner: '+ Magdagdag ng Mag-aaral', name: 'Pangalan', grade: 'Baitang', level: 'Antas', add: 'Idagdag', cancel: 'Kanselahin', noLearners: 'Wala pang mag-aaral — magdagdag ng una.' },
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '??'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function DashboardView({ teacherName, materialsCount, learnerCount, weekAssignments, levelBars, learners, onAddLearner }: DashboardViewProps) {
  const { dict, lang } = useLanguage()
  const router = useRouter()
  const c = COPY[lang]

  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [grade, setGrade] = useState(GRADES[0])
  const [level, setLevel] = useState<Level>('beginning')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    setError(null)
    const result = await onAddLearner({ name: name.trim(), grade, level, avatarInitials: initialsOf(name) })
    setSubmitting(false)
    if (result?.error) {
      setError(result.error)
      return
    }
    setName('')
    setGrade(GRADES[0])
    setLevel('beginning')
    setFormOpen(false)
    router.refresh()
  }

  return (
    <main className="max-w-[1240px] mx-auto px-7 py-9">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-7">
        <div>
          <div className="text-sm font-extrabold text-inkMuted">{dict.dashboard.welcome}</div>
          <h1 className="font-display font-bold text-4xl">{teacherName} 👋</h1>
        </div>
        <Link href="/repository" className="rounded-2xl px-6 py-3 font-display font-semibold cursor-pointer bg-coral text-white shadow-[0_4px_0_#C13A28] inline-block">
          ＋ {dict.dashboard.assignReading}
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        <Card>
          <div className="font-display font-semibold text-lg">{dict.dashboard.stats.materials.title}</div>
          <div className="font-display font-bold text-4xl text-coral mt-3">{materialsCount}</div>
        </Card>
        <Card>
          <div className="font-display font-semibold text-lg">{dict.dashboard.stats.learners.title}</div>
          <div className="font-display font-bold text-4xl text-purple mt-3">{learnerCount}</div>
        </Card>
        <Card>
          <div className="font-display font-semibold text-lg">{dict.dashboard.stats.week.title}</div>
          <div className="font-display font-bold text-4xl text-amber mt-3">{weekAssignments}</div>
        </Card>
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] gap-5">
        <Card>
          <h2 className="font-display font-semibold text-xl mb-5">{dict.dashboard.readingProgress}</h2>
          <div className="flex flex-col gap-5">
            {levelBars.map((b) => (
              <div key={b.level}>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2 font-extrabold text-sm">
                    <span className="w-3 h-3 rounded" style={{ background: LEVEL_COLOR[b.level] }} />
                    {dict.levels[b.level]}
                  </span>
                  <span className="font-extrabold text-sm text-inkMuted">{b.count} {dict.dashboard.learnersWord}</span>
                </div>
                <div className="h-4 bg-[#F3E9D8] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: LEVEL_COLOR[b.level] }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-xl">{dict.dashboard.myLearners}</h2>
            <button type="button" onClick={() => setFormOpen((v) => !v)} className="text-xs font-extrabold text-coral">
              {c.addLearner}
            </button>
          </div>

          {formOpen && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 mb-4 bg-cardAlt border-2 border-cardBorder rounded-2xl p-4">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={c.name}
                className="px-3.5 py-2.5 rounded-xl border-2 border-cardBorder text-sm bg-white"
              />
              <div className="flex gap-2.5">
                <select value={grade} onChange={(e) => setGrade(e.target.value)} className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-cardBorder text-sm bg-white">
                  {GRADES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-cardBorder text-sm bg-white">
                  {LEVELS.map((lv) => (
                    <option key={lv} value={lv}>{dict.levels[lv]}</option>
                  ))}
                </select>
              </div>
              {error && <p role="alert" className="text-coral text-xs font-bold">{error}</p>}
              <div className="flex gap-2.5">
                <Button type="submit" variant="teal" disabled={submitting} className="flex-1 text-sm px-4 py-2.5">
                  {c.add}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)} className="text-sm px-4 py-2.5">
                  {c.cancel}
                </Button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-3">
            {learners.length === 0 && <p className="text-sm text-inkMuted font-bold text-center py-4">{c.noLearners}</p>}
            {learners.map((l) => (
              <div key={l.id} className="flex items-center gap-3 p-3 rounded-2xl bg-cardAlt">
                <div className="w-10 h-10 rounded-xl grid place-items-center font-display font-bold text-white" style={{ background: LEVEL_COLOR[l.level] }}>
                  {l.avatar_initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-sm">{l.name}</div>
                  <div className="text-xs text-inkMuted font-bold">{l.grade} · {l.passageCount} {dict.dashboard.passagesWord}</div>
                </div>
                <LevelBadge level={l.level} label={dict.levels[l.level]} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
