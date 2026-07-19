import { DashboardView } from '@/components/dashboard-view'
import { computeLevelBars } from '@/lib/dashboard/level-bars'
import { createClient } from '@/lib/supabase/server'
import type { Learner } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: teacher } = await supabase.from('teachers').select('display_name').eq('id', user!.id).single()

  const { data: learnersRaw } = await supabase
    .from('learners')
    .select('id, teacher_id, name, grade, level, progress_pct, avatar_initials, assignments(count)')
    .eq('teacher_id', user!.id)

  const learners = (learnersRaw ?? []).map((l) => {
    const { assignments, ...rest } = l as Learner & { assignments: { count: number }[] }
    return { ...rest, passageCount: assignments?.[0]?.count ?? 0 }
  })

  const { count: materialsCount } = await supabase
    .from('passages')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: weekAssignments } = await supabase
    .from('assignments')
    .select('id', { count: 'exact', head: true })
    .eq('assigned_by', user!.id)
    .gte('assigned_at', weekAgo)

  const en = (await import('@/lib/i18n/en')).en

  return (
    <DashboardView
      dict={en}
      teacherName={teacher?.display_name ?? 'Teacher'}
      materialsCount={materialsCount ?? 0}
      learnerCount={learners.length}
      weekAssignments={weekAssignments ?? 0}
      levelBars={computeLevelBars(learners)}
      learners={learners}
    />
  )
}
