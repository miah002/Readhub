'use client'
import { useState } from 'react'
import { clsx } from 'clsx'
import { useLanguage } from '@/lib/i18n/language-context'
import { LevelBadge } from './ui/level-badge'
import { Button } from './ui/button'
import type { Passage, Learner } from '@/lib/types'

interface ReaderViewProps {
  passage: Passage
  learners: Learner[]
  onConfirmAssign: (learnerIds: string[]) => Promise<void>
}

export function ReaderView({ passage, learners, onConfirmAssign }: ReaderViewProps) {
  const { dict } = useLanguage()
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bannerNames, setBannerNames] = useState<string[] | null>(null)

  function toggleLearner(id: string) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  async function handleConfirm() {
    await onConfirmAssign(selectedIds)
    const names = learners.filter((l) => selectedIds.includes(l.id)).map((l) => l.name)
    setBannerNames(names)
    setAssignOpen(false)
    setSelectedIds([])
  }

  return (
    <main className="max-w-[820px] mx-auto px-7 py-9 pb-20">
      <a href="/repository" className="font-extrabold text-sm inline-block mb-5">← {dict.repository.title}</a>
      <div className="bg-white border-2 border-cardBorder rounded-[26px] overflow-hidden">
        <div className="h-40 grid place-items-center text-7xl" style={{ background: passage.cover_bg }}>
          {passage.emoji}
        </div>
        <div className="p-8 pt-7">
          <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
            <LevelBadge level={passage.level} label={dict.levels[passage.level]} />
            <span className="text-sm text-inkMuted font-bold">{passage.theme} · {passage.minutes} min · {passage.competency} · {passage.quarter}</span>
          </div>
          <h1 className="font-display font-bold text-3xl mb-5">{passage.title}</h1>
          <div className="flex flex-col gap-4">
            {passage.body.map((para, i) => (
              <p key={i} className="text-lg leading-loose text-[#3A3548]">{para}</p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-cardBorder flex gap-3 flex-wrap">
            <Button onClick={() => setAssignOpen((v) => !v)}>{dict.reader.assign}</Button>
            <a href="/repository" className="rounded-2xl px-6 py-3 font-display font-semibold cursor-pointer bg-white text-ink border-2 border-cardBorder inline-block">{dict.reader.backToList}</a>
          </div>

          {assignOpen && (
            <div className="mt-4 bg-cardAlt border-2 border-cardBorder rounded-2xl p-5">
              <div className="font-extrabold text-xs text-inkMuted uppercase mb-3">{dict.reader.selectLearners}</div>
              <div className="flex flex-wrap gap-2.5">
                {learners.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => toggleLearner(l.id)}
                    className={clsx(
                      'px-3.5 py-2 rounded-xl text-sm font-extrabold border-2',
                      selectedIds.includes(l.id) ? 'bg-ink text-white border-ink' : 'bg-white text-inkSub border-cardBorder'
                    )}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
              <Button variant="teal" className="mt-4" onClick={handleConfirm}>{dict.reader.confirmAssign}</Button>
            </div>
          )}

          {bannerNames && bannerNames.length > 0 && (
            <div className="mt-4 bg-[#DFF6F1] text-[#1B8577] font-extrabold text-sm px-[18px] py-3.5 rounded-2xl">
              {`✅ ${dict.reader.assignedTo} ${bannerNames.join(', ')}`}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
