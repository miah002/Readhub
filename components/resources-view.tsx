'use client'
import { useLanguage } from '@/lib/i18n/language-context'
import { DEMO_RESOURCES } from '@/lib/demo/demo-content'

const COPY = {
  en: { title: 'Resources', sub: 'Guides, worksheets and videos to support differentiated reading instruction.' },
  fil: { title: 'Mga Resource', sub: 'Mga gabay, worksheet at video para sa differentiated na pagtuturo ng pagbasa.' },
}

export function ResourcesView() {
  const { lang } = useLanguage()
  const c = COPY[lang]

  return (
    <main className="max-w-[1240px] mx-auto px-7 py-9">
      <h1 className="font-display font-bold text-4xl">🗂️ {c.title}</h1>
      <p className="text-inkSub mt-1.5 mb-6">{c.sub}</p>
      <div className="grid grid-cols-4 gap-5">
        {DEMO_RESOURCES.map((r) => (
          <div key={r.title.en} className="bg-white border-2 border-cardBorder rounded-[22px] p-6">
            <div className="w-[52px] h-[52px] rounded-2xl grid place-items-center text-2xl" style={{ background: r.tint }}>{r.icon}</div>
            <div className="text-xs font-extrabold text-inkMuted uppercase mt-4">{lang === 'en' ? r.tag.en : r.tag.fil}</div>
            <div className="font-display font-semibold text-lg mt-1.5">{lang === 'en' ? r.title.en : r.title.fil}</div>
            <p className="text-sm text-inkSub leading-relaxed mt-2">{lang === 'en' ? r.desc.en : r.desc.fil}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
