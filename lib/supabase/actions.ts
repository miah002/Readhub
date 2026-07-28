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

const RESOURCE_ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'mp4']
const RESOURCE_MAX_FILE_BYTES = 20 * 1024 * 1024

export async function uploadResource(formData: FormData): Promise<{ error?: string } | void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const tag = String(formData.get('tag') ?? '')
  const file = formData.get('file')

  if (!title || !description || !tag) return { error: 'Please fill in all fields.' }
  if (!(file instanceof File) || file.size === 0) return { error: 'Please choose a file.' }
  if (file.size > RESOURCE_MAX_FILE_BYTES) return { error: 'File is too large (max 20MB).' }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!RESOURCE_ALLOWED_EXTENSIONS.includes(ext)) return { error: 'Unsupported file type.' }

  const path = `${user.id}/${Date.now()}-${file.name}`
  const { error: uploadError } = await supabase.storage.from('resources').upload(path, file)
  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage.from('resources').getPublicUrl(path)

  const { error: insertError } = await supabase.from('resources').insert({
    title,
    description,
    tag,
    file_path: path,
    file_url: publicUrl,
    uploaded_by: user.id,
  })
  if (insertError) return { error: insertError.message }
}
