import Link from 'next/link'
import { Card } from './ui/card'
import { LevelBadge } from './ui/level-badge'
import { LEVEL_COLOR } from '@/lib/level-colors'
import type { Learner } from '@/lib/types'
import type { LevelBarDatum } from '@/lib/dashboard/level-bars'
import type { Dictionary } from '@/lib/i18n/dictionary'

interface DashboardViewProps {
  dict: Dictionary
  teacherName: string
  materialsCount: number
  learnerCount: number
  weekAssignments: number
  levelBars: LevelBarDatum[]
  learners: (Learner & { passageCount: number })[]
}

export function DashboardView({ dict, teacherName, materialsCount, learnerCount, weekAssignments, levelBars, learners }: DashboardViewProps) {
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
          <h2 className="font-display font-semibold text-xl mb-4">{dict.dashboard.myLearners}</h2>
          <div className="flex flex-col gap-3">
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
