'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from './ui/button'
import { LEVEL_TINT } from '@/lib/level-colors'
import type { CreatePassageInput } from '@/lib/supabase/actions'
import type { Passage, Level, Language } from '@/lib/types'

interface ContentViewProps {
  passages: Passage[]
  onCreatePassage: (input: CreatePassageInput) => Promise<{ error?: string } | void>
}

const GRADES = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6']
const LEVELS: Level[] = ['beginning', 'developing', 'transitioning']
const LANGUAGES: Language[] = ['EN', 'FIL']
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']

const COPY = {
  en: {
    title: 'Content Studio', sub: 'Upload or draft reading materials — every AI-assisted draft is reviewed by a teacher before it reaches the Repository.',
    aiTitle: 'Draft with AI', aiSub: 'Describe the passage you need and generate a starting draft to edit and review.',
    generate: 'Generate Draft', myUploads: 'My Uploads', uploadNew: '+ Upload Material', cancel: 'Cancel',
    formTitle: 'Title', formTheme: 'Theme', formGrade: 'Grade', formLevel: 'Level', formLanguage: 'Language',
    formCompetency: 'Competency', formQuarter: 'Quarter', formMinutes: 'Minutes', formEmoji: 'Emoji', formBody: 'Passage text (one paragraph per line)',
    submit: 'Publish to Repository', noUploads: 'No materials uploaded yet — add your first one.', published: 'Published',
  },
  fil: {
    title: 'Content Studio', sub: 'Mag-upload o gumawa ng babasahin — bawat AI draft ay sinusuri ng guro bago maidagdag sa Imbakan.',
    aiTitle: 'Gumawa gamit ang AI', aiSub: 'Ilarawan ang babasahing kailangan mo at bumuo ng unang draft para baguhin at suriin.',
    generate: 'Bumuo ng Draft', myUploads: 'Aking mga Upload', uploadNew: '+ Mag-upload ng Materyal', cancel: 'Kanselahin',
    formTitle: 'Pamagat', formTheme: 'Tema', formGrade: 'Baitang', formLevel: 'Antas', formLanguage: 'Wika',
    formCompetency: 'Competency', formQuarter: 'Quarter', formMinutes: 'Minuto', formEmoji: 'Emoji', formBody: 'Teksto ng babasahin (isang talata bawat linya)',
    submit: 'Ilathala sa Imbakan', noUploads: 'Wala pang na-upload — magdagdag ng una.', published: 'Nailathala',
  },
}

export function ContentView({ passages, onCreatePassage }: ContentViewProps) {
  const { lang, dict } = useLanguage()
  const router = useRouter()
  const c = COPY[lang]

  const [formOpen, setFormOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('')
  const [grade, setGrade] = useState(GRADES[0])
  const [level, setLevel] = useState<Level>('beginning')
  const [language, setLanguage] = useState<Language>('EN')
  const [competency, setCompetency] = useState('Vocabulary')
  const [quarter, setQuarter] = useState(QUARTERS[0])
  const [minutes, setMinutes] = useState(5)
  const [emoji, setEmoji] = useState('📖')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const bodyParagraphs = body.split('\n').map((p) => p.trim()).filter(Boolean)
    if (!title.trim() || !theme.trim() || bodyParagraphs.length === 0) return

    setSubmitting(true)
    setError(null)
    const result = await onCreatePassage({
      title: title.trim(), theme: theme.trim(), grade, level, language,
      competency, quarter, minutes, emoji: emoji.trim() || '📖',
      coverBg: LEVEL_TINT[level], body: bodyParagraphs,
    })
    setSubmitting(false)
    if (result?.error) {
      setError(result.error)
      return
    }
    setTitle(''); setTheme(''); setGrade(GRADES[0]); setLevel('beginning'); setLanguage('EN')
    setCompetency('Vocabulary'); setQuarter(QUARTERS[0]); setMinutes(5); setEmoji('📖'); setBody('')
    setFormOpen(false)
    router.refresh()
  }

  return (
    <main className="max-w-[1240px] mx-auto px-7 py-9">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
        <div>
          <h1 className="font-display font-bold text-4xl">🤖 {c.title}</h1>
          <p className="text-inkSub mt-1.5 max-w-[640px]">{c.sub}</p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen((v) => !v)}
          className="font-display font-semibold text-[15px] text-white bg-coral px-[22px] py-3 rounded-2xl shadow-[0_4px_0_#C13A28] whitespace-nowrap"
        >
          {formOpen ? c.cancel : c.uploadNew}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-cardBorder rounded-[22px] p-6 mt-6 flex flex-col gap-3.5">
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={c.formTitle} className="px-4 py-3 rounded-xl border-2 border-cardBorder text-sm" />
          <input type="text" required value={theme} onChange={(e) => setTheme(e.target.value)} placeholder={c.formTheme} className="px-4 py-3 rounded-xl border-2 border-cardBorder text-sm" />

          <div className="grid grid-cols-3 gap-3">
            <select value={grade} onChange={(e) => setGrade(e.target.value)} className="px-3.5 py-2.5 rounded-xl border-2 border-cardBorder text-sm">
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="px-3.5 py-2.5 rounded-xl border-2 border-cardBorder text-sm">
              {LEVELS.map((lv) => <option key={lv} value={lv}>{dict.levels[lv]}</option>)}
            </select>
            <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="px-3.5 py-2.5 rounded-xl border-2 border-cardBorder text-sm">
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <input type="text" required value={competency} onChange={(e) => setCompetency(e.target.value)} placeholder={c.formCompetency} className="px-3.5 py-2.5 rounded-xl border-2 border-cardBorder text-sm" />
            <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="px-3.5 py-2.5 rounded-xl border-2 border-cardBorder text-sm">
              {QUARTERS.map((q) => <option key={q} value={q}>{q}</option>)}
            </select>
            <input type="number" min={1} required value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} placeholder={c.formMinutes} className="px-3.5 py-2.5 rounded-xl border-2 border-cardBorder text-sm" />
            <input type="text" value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder={c.formEmoji} className="px-3.5 py-2.5 rounded-xl border-2 border-cardBorder text-sm" />
          </div>

          <textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder={c.formBody} rows={4} className="px-4 py-3 rounded-xl border-2 border-cardBorder text-sm resize-vertical" />

          {error && <p role="alert" className="text-coral text-sm font-bold">{error}</p>}
          <Button type="submit" variant="teal" disabled={submitting}>{c.submit}</Button>
        </form>
      )}

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
          {passages.length === 0 && <p className="text-sm text-inkMuted font-bold text-center py-6">{c.noUploads}</p>}
          {passages.map((p) => (
            <div key={p.id} className="flex items-center gap-3.5 px-[18px] py-4 border-b-2 border-dashed border-cardBorder last:border-0">
              <span className="text-xl">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-[15px]">{p.title}</div>
                <div className="text-xs text-inkMuted font-bold">{p.grade} · {p.competency} · {p.language}</div>
              </div>
              <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full whitespace-nowrap bg-[#DFF6F1] text-[#1B8577]">
                {c.published}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
