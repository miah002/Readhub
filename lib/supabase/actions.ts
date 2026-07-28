'use server'
import { redirect } from 'next/navigation'
import { createClient } from './server'
import type { Level, Language } from '@/lib/types'

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

export interface AddLearnerInput {
  name: string
  grade: string
  level: Level
  avatarInitials: string
}

export async function addLearner(input: AddLearnerInput): Promise<{ error?: string } | void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { error } = await supabase.from('learners').insert({
    teacher_id: user.id,
    name: input.name,
    grade: input.grade,
    level: input.level,
    avatar_initials: input.avatarInitials,
  })
  if (error) return { error: error.message }
}

export interface CreatePassageInput {
  title: string
  theme: string
  grade: string
  level: Level
  language: Language
  competency: string
  quarter: string
  minutes: number
  emoji: string
  coverBg: string
  body: string[]
}

export async function createPassage(input: CreatePassageInput): Promise<{ error?: string } | void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { error } = await supabase.from('passages').insert({
    title: input.title,
    theme: input.theme,
    grade: input.grade,
    level: input.level,
    language: input.language,
    competency: input.competency,
    quarter: input.quarter,
    minutes: input.minutes,
    emoji: input.emoji,
    cover_bg: input.coverBg,
    body: input.body,
    status: 'published',
    source: 'teacher',
    created_by: user.id,
  })
  if (error) return { error: error.message }
}
