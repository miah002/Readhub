'use client'
import { useLanguage } from '@/lib/i18n/language-context'
import { DEMO_UPLOADS, UPLOAD_STATUS_LABEL, UPLOAD_STATUS_COLOR, UPLOAD_STATUS_TINT } from '@/lib/demo/demo-content'

const COPY = {
  en: {
    title: 'Content Studio', sub: 'Upload or draft reading materials — every AI-assisted draft is reviewed by a teacher before it reaches the Repository.',
    aiTitle: 'Draft with AI', aiSub: 'Describe the passage you need and generate a starting draft to edit and review.',
    generate: 'Generate Draft', myUploads: 'My Uploads', uploadNew: '+ Upload Material',
  },
  fil: {
    title: 'Content Studio', sub: 'Mag-upload o gumawa ng babasahin — bawat AI draft ay sinusuri ng guro bago maidagdag sa Imbakan.',
    aiTitle: 'Gumawa gamit ang AI', aiSub: 'Ilarawan ang babasahing kailangan mo at bumuo ng unang draft para baguhin at suriin.',
    generate: 'Bumuo ng Draft', myUploads: 'Aking mga Upload', uploadNew: '+ Mag-upload ng Materyal',
  },
}

export function ContentView() {
  const { lang } = useLanguage()
  const c = COPY[lang]
  const statusLabel = UPLOAD_STATUS_LABEL[lang]

  return (
    <main className="max-w-[1240px] mx-auto px-7 py-9">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
        <div>
          <h1 className="font-display font-bold text-4xl">🤖 {c.title}</h1>
          <p className="text-inkSub mt-1.5 max-w-[640px]">{c.sub}</p>
        </div>
        <button type="button" disabled className="font-display font-semibold text-[15px] text-white bg-coral px-[22px] py-3 rounded-2xl shadow-[0_4px_0_#C13A28] whitespace-nowrap opacity-90 cursor-default">
          {c.uploadNew}
        </button>
      </div>

      <div className="bg-white border-2 border-cardBorder rounded-[22px] p-6 mt-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="text-xl">✨</span>
          <h2 className="font-display font-semibold text-xl">{c.aiTitle}</h2>
        </div>
        <p className="text-sm text-inkSub mb-4">{c.aiSub}</p>
        <div className="flex gap-3 flex-wrap items-center">
          <input
            type="text"
            disabled
            placeholder="Grade 2 · Comprehension · Community helpers"
            className="flex-1 min-w-[260px] px-4 py-3 rounded-xl border-2 border-cardBorder text-sm bg-cardAlt"
          />
          <button type="button" disabled className="font-display font-semibold text-[15px] text-white bg-purple px-5 py-3 rounded-2xl shadow-[0_4px_0_#5A4DC0] whitespace-nowrap opacity-90 cursor-default">
            🪄 {c.generate}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-display font-semibold text-xl mb-3.5">{c.myUploads}</h2>
        <div className="bg-white border-2 border-cardBorder rounded-[22px] p-2">
          {DEMO_UPLOADS.map((u) => (
            <div key={u.title.en} className="flex items-center gap-3.5 px-[18px] py-4 border-b-2 border-dashed border-cardBorder last:border-0">
              <span className="text-xl">{u.source === 'ai' ? '🤖' : '✍️'}</span>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-[15px]">{lang === 'en' ? u.title.en : u.title.fil}</div>
                <div className="text-xs text-inkMuted font-bold">{u.grade} · {u.competency} · {lang === 'en' ? u.date.en : u.date.fil}</div>
              </div>
              <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full whitespace-nowrap" style={{ color: UPLOAD_STATUS_COLOR[u.status], background: UPLOAD_STATUS_TINT[u.status] }}>
                {statusLabel[u.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
