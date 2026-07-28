import { ContentView } from '@/components/content-view'
import { createClient } from '@/lib/supabase/server'
import { createPassage } from '@/lib/supabase/actions'
import type { Passage } from '@/lib/types'

export default async function ContentPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: passages } = await supabase
    .from('passages')
    .select('id, title, theme, grade, level, language, competency, quarter, minutes, emoji, cover_bg, body, status, source, created_by')
    .eq('created_by', user!.id)
    .order('created_at', { ascending: false })

  return <ContentView passages={(passages ?? []) as Passage[]} onCreatePassage={createPassage} />
}
