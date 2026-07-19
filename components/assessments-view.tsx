'use client'
import { useLanguage } from '@/lib/i18n/language-context'
import { DEMO_ASSESSMENTS, ASSESS_TYPE_TINT, ASSESS_TYPE_ICON, ASSESS_TYPE_LABEL, ASSESS_STATUS_LABEL, ASSESS_STATUS_COLOR, ASSESS_STATUS_TINT } from '@/lib/demo/demo-content'

const COPY = {
  en: { title: 'Assessments', sub: 'Track CRLA and Phil-IRI results — comprehension, fluency and vocabulary — across your class.', avgScore: 'Avg. Score', learners: 'learners' },
  fil: { title: 'Mga Pagtatasa', sub: 'Subaybayan ang CRLA at Phil-IRI — pag-unawa, katatasan at bokabularyo — sa iyong klase.', avgScore: 'Avg. Marka', learners: 'mag-aaral' },
}

export function AssessmentsView() {
  const { lang } = useLanguage()
  const c = COPY[lang]
  const typeLabel = ASSESS_TYPE_LABEL[lang]
  const statusLabel = ASSESS_STATUS_LABEL[lang]

  return (
    <main className="max-w-[1240px] mx-auto px-7 py-9">
      <h1 className="font-display font-bold text-4xl">📝 {c.title}</h1>
      <p className="text-inkSub mt-1.5">{c.sub}</p>
      <div className="flex flex-col gap-3.5 mt-6">
        {DEMO_ASSESSMENTS.map((a) => {
          const status = a.completed === a.total ? 'c' : a.completed > 0 ? 'ip' : 'ns'
          return (
            <div key={a.title} className="bg-white border-2 border-cardBorder rounded-[20px] px-[22px] py-5 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl flex-shrink-0" style={{ background: ASSESS_TYPE_TINT[a.type] }}>
                {ASSESS_TYPE_ICON[a.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-lg">{a.title}</div>
                <div className="text-sm text-inkMuted font-bold mt-0.5">{typeLabel[a.type]} · {a.grade} · {a.completed}/{a.total} {c.learners}</div>
              </div>
              <div className="text-center min-w-[74px]">
                <div className="font-display font-bold text-xl">{a.avg}%</div>
                <div className="text-[11px] font-extrabold text-inkMuted">{c.avgScore}</div>
              </div>
              <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full whitespace-nowrap" style={{ color: ASSESS_STATUS_COLOR[status], background: ASSESS_STATUS_TINT[status] }}>
                {statusLabel[status]}
              </span>
            </div>
          )
        })}
      </div>
    </main>
  )
}
