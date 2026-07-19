'use client'
import { useLanguage } from '@/lib/i18n/language-context'
import { DEMO_NOTIFICATIONS } from '@/lib/demo/demo-content'

const COPY = {
  en: { title: 'Notifications', sub: 'Updates about your learners and reading materials.' },
  fil: { title: 'Mga Abiso', sub: 'Mga update tungkol sa iyong mga mag-aaral at babasahin.' },
}

export function NotificationsView() {
  const { lang } = useLanguage()
  const c = COPY[lang]

  return (
    <main className="max-w-[760px] mx-auto px-7 py-9">
      <h1 className="font-display font-bold text-4xl">🔔 {c.title}</h1>
      <p className="text-inkSub mt-1.5 mb-6">{c.sub}</p>
      <div className="flex flex-col gap-3">
        {DEMO_NOTIFICATIONS.map((n) => (
          <div key={n.title.en} className="flex gap-3.5 items-start bg-white border-2 border-cardBorder rounded-2xl px-5 py-[18px]">
            <div className="w-[42px] h-[42px] rounded-xl bg-[#FBEFDD] grid place-items-center text-xl flex-shrink-0">{n.icon}</div>
            <div className="flex-1">
              <div className="font-extrabold text-[15.5px]">{lang === 'en' ? n.title.en : n.title.fil}</div>
              <div className="text-sm text-inkSub mt-1">{lang === 'en' ? n.desc.en : n.desc.fil}</div>
              <div className="text-xs text-inkMuted font-bold mt-2">{lang === 'en' ? n.time.en : n.time.fil}</div>
            </div>
            {n.unread && <span className="w-2.5 h-2.5 rounded-full bg-coral flex-shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
    </main>
  )
}
