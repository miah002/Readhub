'use server'
import { redirect } from 'next/navigation'
import { createClient } from './server'

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function assignPassage(passageId: string, learnerIds: string[]) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const rows = learnerIds.map((learner_id) => ({ passage_id: passageId, learner_id, assigned_by: user.id }))
  const { error } = await supabase.from('assignments').insert(rows)
  if (error) throw new Error(error.message)
}
