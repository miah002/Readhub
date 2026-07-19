'use client'
import { useLanguage } from '@/lib/i18n/language-context'
import { LEVEL_COLOR, LEVEL_TINT } from '@/lib/level-colors'
import { DEMO_LEARNERS, DEMO_REPORT_SUMMARY, DEMO_REPORT_TYPES } from '@/lib/demo/demo-content'

const COPY = {
  en: { title: 'Reports', sub: 'Generate learner progress, intervention summary, class performance and ARAL accomplishment reports.', generate: 'Generate', download: 'Download', progress: 'reading progress' },
  fil: { title: 'Mga Ulat', sub: 'Bumuo ng ulat sa progreso, buod ng interbensyon, performance ng klase at ARAL accomplishment.', generate: 'Bumuo', download: 'I-download', progress: 'progreso sa pagbasa' },
}

export function ReportsView() {
  const { lang, dict } = useLanguage()
  const c = COPY[lang]
  const summary = DEMO_REPORT_SUMMARY[lang]
  const types = DEMO_REPORT_TYPES[lang]

  return (
    <main className="max-w-[1240px] mx-auto px-7 py-9">
      <h1 className="font-display font-bold text-4xl">📊 {c.title}</h1>
      <p className="text-inkSub mt-1.5">{c.sub}</p>

      <div className="grid grid-cols-3 gap-5 my-6">
        {summary.map((r) => (
          <div key={r.title} className="bg-white border-2 border-cardBorder rounded-[22px] p-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl grid place-items-center text-2xl" style={{ background: r.tint }}>{r.icon}</div>
              <div className="font-display font-semibold">{r.title}</div>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <div className="font-display font-bold text-4xl leading-none" style={{ color: r.color }}>{r.big}</div>
              <div className="text-sm font-bold text-inkMuted">{r.unit}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-6">
        {types.map((t) => (
          <div key={t.label} className="bg-white border-2 border-cardBorder rounded-2xl px-[18px] py-4 flex items-center gap-3">
            <span className="text-2xl">{t.icon}</span>
            <div className="flex-1 font-display font-semibold text-sm leading-tight">{t.label}</div>
            <button type="button" className="font-display font-semibold text-xs bg-[#FBEFDD] border-2 border-cardBorder px-3.5 py-2 rounded-lg whitespace-nowrap">
              ⬇ {c.generate}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-cardBorder rounded-[22px] p-2">
        {DEMO_LEARNERS.map((l) => (
          <div key={l.initials} className="flex items-center gap-3.5 px-[18px] py-4 border-b-2 border-dashed border-cardBorder last:border-0">
            <div className="w-[42px] h-[42px] rounded-xl grid place-items-center font-display font-bold text-sm text-white" style={{ background: l.avatarBg }}>
              {l.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-sm">{l.name}</div>
              <div className="text-xs text-inkMuted font-bold">{l.grade} · {l.progressPct}% {c.progress}</div>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full" style={{ color: LEVEL_COLOR[l.level], background: LEVEL_TINT[l.level] }}>
              {dict.levels[l.level]}
            </span>
            <button type="button" className="font-display font-semibold text-[13.5px] bg-[#FBEFDD] border-2 border-cardBorder px-4 py-2 rounded-[11px] whitespace-nowrap">
              ⬇ {c.download}
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
