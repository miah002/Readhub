'use client'
import { useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from './ui/button'
import type { Resource, ResourceTag } from '@/lib/types'

interface ResourcesViewProps {
  resources: Resource[]
  onUpload: (formData: FormData) => Promise<{ error?: string } | void>
}

const TAGS: ResourceTag[] = ['Guide', 'Worksheet', 'Video', 'Reference']
const TAG_TINT: Record<ResourceTag, string> = { Guide: '#FFE0D8', Worksheet: '#FEEFCB', Video: '#E3DEFF', Reference: '#DFF6F1' }
const TAG_ICON: Record<ResourceTag, string> = { Guide: '📄', Worksheet: '🖨️', Video: '🎥', Reference: '📋' }

const COPY = {
  en: {
    title: 'Resources', sub: 'Guides, worksheets and videos to support differentiated reading instruction.',
    uploadNew: '+ Upload Resource', cancel: 'Cancel', formTitle: 'Title', formDesc: 'Description', formTag: 'Category',
    formFile: 'File (PDF, Word, image, or video — max 20MB)', submit: 'Upload', download: 'Download',
    noResources: 'No resources uploaded yet — add your first one.',
  },
  fil: {
    title: 'Mga Resource', sub: 'Mga gabay, worksheet at video para sa differentiated na pagtuturo ng pagbasa.',
    uploadNew: '+ Mag-upload ng Resource', cancel: 'Kanselahin', formTitle: 'Pamagat', formDesc: 'Deskripsyon', formTag: 'Kategorya',
    formFile: 'File (PDF, Word, larawan, o video — max 20MB)', submit: 'I-upload', download: 'I-download',
    noResources: 'Wala pang na-upload — magdagdag ng una.',
  },
}

export function ResourcesView({ resources, onUpload }: ResourcesViewProps) {
  const { lang } = useLanguage()
  const router = useRouter()
  const c = COPY[lang]
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tag, setTag] = useState<ResourceTag>('Guide')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const file = fileInputRef.current?.files?.[0]
    if (!title.trim() || !description.trim() || !file) return

    const formData = new FormData()
    formData.set('title', title.trim())
    formData.set('description', description.trim())
    formData.set('tag', tag)
    formData.set('file', file)

    setSubmitting(true)
    setError(null)
    const result = await onUpload(formData)
    setSubmitting(false)
    if (result?.error) {
      setError(result.error)
      return
    }
    setTitle('')
    setDescription('')
    setTag('Guide')
    if (fileInputRef.current) fileInputRef.current.value = ''
    setFormOpen(false)
    router.refresh()
  }

  return (
    <main className="max-w-[1240px] mx-auto px-7 py-9">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
        <div>
          <h1 className="font-display font-bold text-4xl">🗂️ {c.title}</h1>
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
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder={c.formDesc} rows={2} className="px-4 py-3 rounded-xl border-2 border-cardBorder text-sm resize-vertical" />
          <select value={tag} onChange={(e) => setTag(e.target.value as ResourceTag)} aria-label={c.formTag} className="px-3.5 py-2.5 rounded-xl border-2 border-cardBorder text-sm">
            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <div>
            <label className="text-xs font-extrabold text-inkMuted block mb-1.5">{c.formFile}</label>
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.mp4" className="text-sm" />
          </div>
          {error && <p role="alert" className="text-coral text-sm font-bold">{error}</p>}
          <Button type="submit" variant="teal" disabled={submitting}>{c.submit}</Button>
        </form>
      )}

      <div className="grid grid-cols-4 gap-5 mt-6">
        {resources.length === 0 && <p className="text-sm text-inkMuted font-bold text-center py-6 col-span-4">{c.noResources}</p>}
        {resources.map((r) => (
          <div key={r.id} className="bg-white border-2 border-cardBorder rounded-[22px] p-6 flex flex-col">
            <div className="w-[52px] h-[52px] rounded-2xl grid place-items-center text-2xl" style={{ background: TAG_TINT[r.tag] }}>{TAG_ICON[r.tag]}</div>
            <div className="text-xs font-extrabold text-inkMuted uppercase mt-4">{r.tag}</div>
            <div className="font-display font-semibold text-lg mt-1.5">{r.title}</div>
            <p className="text-sm text-inkSub leading-relaxed mt-2 flex-1">{r.description}</p>
            <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="font-display font-semibold text-sm text-coral mt-3.5 inline-block">
              ⬇ {c.download}
            </a>
          </div>
        ))}
      </div>
    </main>
  )
}
