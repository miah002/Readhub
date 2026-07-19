'use client'
import { useLanguage } from '@/lib/i18n/language-context'
import { DEMO_ADMIN_CARDS } from '@/lib/demo/demo-content'

const COPY = {
  en: { title: 'Admin Panel', sub: 'Manage teachers, content and school-wide settings.' },
  fil: { title: 'Admin Panel', sub: 'Pamahalaan ang mga guro, nilalaman at setting ng paaralan.' },
}

export function AdminView() {
  const { lang } = useLanguage()
  const c = COPY[lang]

  return (
    <main className="max-w-[1240px] mx-auto px-7 py-9">
      <h1 className="font-display font-bold text-4xl">🛠️ {c.title}</h1>
      <p className="text-inkSub mt-1.5 mb-6">{c.sub}</p>
      <div className="grid grid-cols-2 gap-5">
        {DEMO_ADMIN_CARDS.map((a) => (
          <div key={a.title.en} className="bg-white border-2 border-cardBorder rounded-[22px] p-6 flex items-center gap-4">
            <div className="w-[52px] h-[52px] rounded-2xl grid place-items-center text-2xl flex-shrink-0" style={{ background: a.tint }}>{a.icon}</div>
            <div>
              <div className="font-display font-semibold text-lg">{lang === 'en' ? a.title.en : a.title.fil}</div>
              <div className="text-sm text-inkSub mt-1">{lang === 'en' ? a.desc.en : a.desc.fil}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
