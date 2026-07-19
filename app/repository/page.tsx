import { RepositoryView } from '@/components/repository-view'
import { createClient } from '@/lib/supabase/server'
import type { Passage } from '@/lib/types'

export default async function RepositoryPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('passages')
    .select('id, title, theme, grade, level, language, competency, quarter, minutes, emoji, cover_bg, body, status, source, created_by')
    .eq('status', 'published')

  return <RepositoryView passages={(data ?? []) as Passage[]} />
}
