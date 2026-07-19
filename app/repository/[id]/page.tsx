import { notFound } from 'next/navigation'
import { ReaderView } from '@/components/reader-view'
import { createClient } from '@/lib/supabase/server'
import { assignPassage } from '@/lib/supabase/actions'
import type { Passage, Learner } from '@/lib/types'

export default async function ReaderPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: passage } = await supabase
    .from('passages')
    .select('id, title, theme, grade, level, language, competency, quarter, minutes, emoji, cover_bg, body, status, source, created_by')
    .eq('id', params.id)
    .single()

  if (!passage) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: learners } = await supabase
    .from('learners')
    .select('id, teacher_id, name, grade, level, progress_pct, avatar_initials')
    .eq('teacher_id', user!.id)

  async function confirmAssign(learnerIds: string[]) {
    'use server'
    await assignPassage(params.id, learnerIds)
  }

  return (
    <ReaderView
      passage={passage as Passage}
      learners={(learners ?? []) as Learner[]}
      onConfirmAssign={confirmAssign}
    />
  )
}
