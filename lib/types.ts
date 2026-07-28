export type Level = 'beginning' | 'developing' | 'transitioning'
export type Language = 'EN' | 'FIL'
export type PassageStatus = 'published' | 'pending' | 'revision'
export type PassageSource = 'teacher' | 'ai'

export interface Learner {
  id: string
  teacher_id: string
  name: string
  grade: string
  level: Level
  progress_pct: number
  avatar_initials: string
}

export interface Passage {
  id: string
  title: string
  theme: string
  grade: string
  level: Level
  language: Language
  competency: string
  quarter: string
  minutes: number
  emoji: string
  cover_bg: string
  body: string[]
  status: PassageStatus
  source: PassageSource
  created_by: string
}

export interface Assignment {
  id: string
  passage_id: string
  learner_id: string
  assigned_by: string
  assigned_at: string
}

export type ResourceTag = 'Guide' | 'Worksheet' | 'Video' | 'Reference'

export interface Resource {
  id: string
  title: string
  description: string
  tag: ResourceTag
  file_path: string
  file_url: string
  uploaded_by: string
  created_at: string
}
