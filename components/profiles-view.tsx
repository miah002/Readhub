'use client'
import { useLanguage } from '@/lib/i18n/language-context'
import { LEVEL_COLOR, LEVEL_TINT } from '@/lib/level-colors'
import { DEMO_LEARNERS } from '@/lib/demo/demo-content'

const COPY = {
  en: { title: 'Learner Profiles', sub: 'Assessment results, instructional level, intervention history and remarks for every learner.', assignedLevel: 'Assigned Level', scores: 'Assessment Scores', crla: 'CRLA', philIri: 'Phil-IRI', remarks: 'Teacher Remarks', history: 'Intervention History', progress: 'Reading Progress', passages: 'passages', viewProfile: 'View Profile' },
  fil: { title: 'Profile ng mga Mag-aaral', sub: 'Resulta ng pagtatasa, instructional level, kasaysayan ng interbensyon at puna para sa bawat mag-aaral.', assignedLevel: 'Itinakdang Antas', scores: 'Resulta ng Pagtatasa', crla: 'CRLA', philIri: 'Phil-IRI', remarks: 'Puna ng Guro', history: 'Kasaysayan ng Interbensyon', progress: 'Progreso sa Pagbasa', passages: 'babasahin', viewProfile: 'Tingnan ang Profile' },
}

export function ProfilesView() {
  const { lang, dict } = useLanguage()
  const c = COPY[lang]

  return (
    <main className="max-w-[1240px] mx-auto px-7 py-9">
      <h1 className="font-display font-bold text-4xl">🧒 {c.title}</h1>
      <p className="text-inkSub mt-1.5">{c.sub}</p>
      <div className="flex flex-col gap-5 mt-6">
        {DEMO_LEARNERS.map((l) => (
          <div key={l.initials} className="bg-white border-2 border-cardBorder rounded-[22px] p-6">
            <div className="flex items-center gap-3.5">
              <div className="w-[52px] h-[52px] rounded-2xl grid place-items-center font-display font-bold text-xl text-white" style={{ background: l.avatarBg }}>
                {l.initials}
              </div>
              <div className="flex-1">
                <div className="font-display font-semibold text-lg">{l.name}</div>
                <div className="text-sm font-bold text-inkMuted">{l.grade} · {c.assignedLevel}: {dict.levels[l.level]}</div>
              </div>
              <span className="text-xs font-extrabold px-3 py-1.5 rounded-full" style={{ color: LEVEL_COLOR[l.level], background: LEVEL_TINT[l.level] }}>
                {dict.levels[l.level]}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold text-inkMuted mb-1.5">
                <span>{c.progress}</span>
                <span>{l.progressPct}%</span>
              </div>
              <div className="h-3 bg-[#F3E9D8] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${l.progressPct}%`, background: LEVEL_COLOR[l.level] }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 mt-5 pt-[18px] border-t-2 border-dashed border-cardBorder">
              <div>
                <div className="text-xs font-extrabold text-inkMuted uppercase mb-2">{c.scores}</div>
                <div className="flex gap-2.5">
                  <div className="flex-1 bg-cardAlt rounded-xl px-3 py-2.5">
                    <div className="text-[11px] font-extrabold text-inkMuted">{c.crla}</div>
                    <div className="font-display font-bold text-lg">{l.crla}</div>
                  </div>
                  <div className="flex-1 bg-cardAlt rounded-xl px-3 py-2.5">
                    <div className="text-[11px] font-extrabold text-inkMuted">{c.philIri}</div>
                    <div className="font-display font-bold text-sm">{l.philIri}</div>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-inkMuted uppercase mt-3.5 mb-2">{c.remarks}</div>
                <p className="text-sm text-inkSub leading-relaxed">{lang === 'en' ? l.remarks.en : l.remarks.fil}</p>
              </div>
              <div>
                <div className="text-xs font-extrabold text-inkMuted uppercase mb-2">{c.history}</div>
                <div className="flex flex-col gap-2">
                  {l.history.map((h) => (
                    <div key={h.en} className="text-[13.5px] text-[#3A3548] bg-cardAlt rounded-lg px-3 py-2.5">
                      {lang === 'en' ? h.en : h.fil}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-[18px] pt-4 border-t-2 border-dashed border-cardBorder">
              <div className="text-sm text-inkSub font-bold">{l.passages} {c.passages} · {lang === 'en' ? l.lastActive.en : l.lastActive.fil}</div>
              <span className="font-extrabold text-sm">{c.viewProfile} →</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
