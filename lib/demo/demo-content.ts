import type { Level } from '@/lib/types'

export interface DemoLearner {
  name: string
  initials: string
  grade: string
  level: Level
  avatarBg: string
  progressPct: number
  passages: number
  lastActive: { en: string; fil: string }
  crla: string
  philIri: string
  remarks: { en: string; fil: string }
  history: { en: string; fil: string }[]
}

export const DEMO_LEARNERS: DemoLearner[] = [
  {
    name: 'Maria Santos', initials: 'MS', grade: 'Grade 2', level: 'developing', avatarBg: '#F5A623',
    progressPct: 64, passages: 8, lastActive: { en: '2 hours ago', fil: '2 oras ang nakalipas' },
    crla: '78%', philIri: 'Instructional',
    remarks: { en: 'Improving steadily; needs continued support with multisyllabic words.', fil: 'Unti-unting umuunlad; kailangan pa ng tulong sa mga salitang maraming pantig.' },
    history: [
      { en: 'May 2026 — Started Tier 2 intervention', fil: 'Mayo 2026 — Nagsimula sa Tier 2 intervention' },
      { en: 'Feb 2026 — Phil-IRI reassessment', fil: 'Peb 2026 — Muling pagtatasa sa Phil-IRI' },
    ],
  },
  {
    name: 'Juan Dela Cruz', initials: 'JC', grade: 'Grade 1', level: 'beginning', avatarBg: '#F04E37',
    progressPct: 38, passages: 4, lastActive: { en: '1 day ago', fil: '1 araw ang nakalipas' },
    crla: '54%', philIri: 'Frustration',
    remarks: { en: 'Needs one-on-one phonics support; easily discouraged with longer texts.', fil: 'Kailangan ng one-on-one na tulong sa ponetika; mabilis mapanghinaan ng loob sa mahahabang teksto.' },
    history: [{ en: 'Jun 2026 — Referred for daily intervention', fil: 'Hun 2026 — Na-refer para sa araw-araw na interbensyon' }],
  },
  {
    name: 'Angel Reyes', initials: 'AR', grade: 'Grade 3', level: 'transitioning', avatarBg: '#29B6A4',
    progressPct: 89, passages: 12, lastActive: { en: '3 hours ago', fil: '3 oras ang nakalipas' },
    crla: '94%', philIri: 'Independent',
    remarks: { en: 'Reading above grade level; ready for enrichment passages.', fil: 'Bumabasa nang higit sa antas; handa na para sa mas mahirap na babasahin.' },
    history: [{ en: 'Apr 2026 — Moved to Transitioning level', fil: 'Abr 2026 — Lumipat sa antas na Lumilipat' }],
  },
  {
    name: 'Miguel Torres', initials: 'MT', grade: 'Grade 2', level: 'beginning', avatarBg: '#7A6CF0',
    progressPct: 45, passages: 5, lastActive: { en: '2 days ago', fil: '2 araw ang nakalipas' },
    crla: '61%', philIri: 'Instructional',
    remarks: { en: 'Responds well to picture-supported texts; building reading confidence.', fil: 'Mahusay tumugon sa babasahing may larawan; unti-unting nagkakaroon ng kumpiyansa.' },
    history: [{ en: 'Mar 2026 — Started Tier 1 intervention', fil: 'Mar 2026 — Nagsimula sa Tier 1 intervention' }],
  },
]

export interface DemoAssessment {
  title: string
  type: 'comp' | 'flu' | 'voc'
  grade: string
  completed: number
  total: number
  avg: number
}

export const DEMO_ASSESSMENTS: DemoAssessment[] = [
  { title: 'Reading Comprehension Check', type: 'comp', grade: 'G2', completed: 24, total: 32, avg: 82 },
  { title: 'Oral Fluency Test', type: 'flu', grade: 'G3', completed: 18, total: 30, avg: 76 },
  { title: 'Vocabulary Builder Quiz', type: 'voc', grade: 'G1', completed: 15, total: 15, avg: 91 },
  { title: 'Story Retelling Assessment', type: 'comp', grade: 'G4', completed: 9, total: 28, avg: 68 },
]

export const ASSESS_TYPE_TINT: Record<DemoAssessment['type'], string> = { comp: '#FFE0D8', flu: '#E3DEFF', voc: '#FEEFCB' }
export const ASSESS_TYPE_ICON: Record<DemoAssessment['type'], string> = { comp: '📖', flu: '🗣️', voc: '🔤' }
export const ASSESS_TYPE_LABEL = {
  en: { comp: 'Comprehension', flu: 'Fluency', voc: 'Vocabulary' },
  fil: { comp: 'Pag-unawa', flu: 'Katatasan', voc: 'Bokabularyo' },
}
export const ASSESS_STATUS_LABEL = {
  en: { ns: 'Not Started', ip: 'In Progress', c: 'Completed' },
  fil: { ns: 'Hindi pa Sinisimulan', ip: 'Isinasagawa', c: 'Tapos na' },
}
export const ASSESS_STATUS_COLOR = { c: '#29B6A4', ip: '#F5A623', ns: '#A79883' }
export const ASSESS_STATUS_TINT = { c: '#DFF6F1', ip: '#FEEFCB', ns: '#F3E9D8' }

export interface DemoNotification {
  icon: string
  title: { en: string; fil: string }
  desc: { en: string; fil: string }
  time: { en: string; fil: string }
  unread: boolean
}

export const DEMO_NOTIFICATIONS: DemoNotification[] = [
  {
    icon: '📬', unread: true,
    title: { en: '12 new passages uploaded', fil: '12 bagong babasahin na-upload' },
    desc: { en: 'Grade 3-4 reading materials added this week.', fil: 'Mga babasahin para sa Baitang 3-4 idinagdag ngayong linggo.' },
    time: { en: '2 hours ago', fil: '2 oras ang nakalipas' },
  },
  {
    icon: '⚠️', unread: true,
    title: { en: '5 learners need support', fil: '5 mag-aaral ang nangangailangan ng tulong' },
    desc: { en: 'Reading level below target for 2+ weeks.', fil: 'Mas mababa sa target ang antas ng pagbasa sa loob ng 2+ linggo.' },
    time: { en: '1 day ago', fil: '1 araw ang nakalipas' },
  },
  {
    icon: '✅', unread: false,
    title: { en: 'Quarterly report ready', fil: 'Handa na ang Ulat Quarterly' },
    desc: { en: 'Q2 reading progress report is ready to download.', fil: 'Handa nang i-download ang Q2 na ulat ng progreso.' },
    time: { en: '2 days ago', fil: '2 araw ang nakalipas' },
  },
  {
    icon: '🎉', unread: false,
    title: { en: 'Angel Reyes reached Transitioning', fil: 'Umabot si Angel Reyes sa Lumilipat' },
    desc: { en: 'Great progress this month!', fil: 'Magandang progreso ngayong buwan!' },
    time: { en: '3 days ago', fil: '3 araw ang nakalipas' },
  },
]

export interface DemoResource {
  icon: string
  title: { en: string; fil: string }
  desc: { en: string; fil: string }
  tag: { en: string; fil: string }
  tint: string
}

export const DEMO_RESOURCES: DemoResource[] = [
  {
    icon: '📄', tint: '#FFE0D8',
    title: { en: 'Parent Reading Guide', fil: 'Gabay sa Magulang sa Pagbasa' },
    desc: { en: 'Simple tips for supporting reading at home.', fil: 'Payak na mga tip para suportahan ang pagbasa sa bahay.' },
    tag: { en: 'Guide', fil: 'Gabay' },
  },
  {
    icon: '🖨️', tint: '#FEEFCB',
    title: { en: 'Printable Phonics Worksheets', fil: 'Nakalimbag na Worksheet sa Ponetika' },
    desc: { en: 'Grade 1–2 practice sheets for letter sounds.', fil: 'Practice sheets para sa Baitang 1–2.' },
    tag: { en: 'Worksheet', fil: 'Worksheet' },
  },
  {
    icon: '🎥', tint: '#E3DEFF',
    title: { en: 'Read-Aloud Technique Video', fil: 'Video ng Teknik sa Pagbasa nang Malakas' },
    desc: { en: 'A short training video for teachers and parents.', fil: 'Maikling video para sa mga guro at magulang.' },
    tag: { en: 'Video', fil: 'Video' },
  },
  {
    icon: '📋', tint: '#DFF6F1',
    title: { en: 'Reading Level Rubric', fil: 'Rubric ng Antas ng Pagbasa' },
    desc: { en: 'How Beginning, Developing and Transitioning are scored.', fil: 'Paano sinusukat ang Nagsisimula, Umuunlad at Lumilipat.' },
    tag: { en: 'Reference', fil: 'Reference' },
  },
]

export interface DemoAdminCard {
  icon: string
  title: { en: string; fil: string }
  desc: { en: string; fil: string }
  tint: string
}

export const DEMO_ADMIN_CARDS: DemoAdminCard[] = [
  { icon: '👩‍🏫', tint: '#FFE0D8', title: { en: 'Manage Teachers', fil: 'Pamahalaan ang mga Guro' }, desc: { en: '12 active teacher accounts', fil: '12 aktibong account ng guro' } },
  { icon: '📚', tint: '#FEEFCB', title: { en: 'Manage Content', fil: 'Pamahalaan ang Nilalaman' }, desc: { en: '248 published passages · 2 pending approval', fil: '248 nailathalang babasahin · 2 naghihintay ng approval' } },
  { icon: '⚙️', tint: '#E3DEFF', title: { en: 'School Settings', fil: 'Setting ng Paaralan' }, desc: { en: 'San Joaquin Elementary configuration', fil: 'Konfigurasyon ng San Joaquin Elementary' } },
  { icon: '📊', tint: '#DFF6F1', title: { en: 'Usage Reports', fil: 'Ulat ng Paggamit' }, desc: { en: 'Platform-wide adoption and engagement', fil: 'Paggamit ng buong platform' } },
]

export interface DemoUpload {
  title: { en: string; fil: string }
  grade: string
  competency: string
  status: 'published' | 'pending' | 'revision'
  date: { en: string; fil: string }
  source: 'teacher' | 'ai'
}

export const DEMO_UPLOADS: DemoUpload[] = [
  { title: { en: 'Barangay Fiesta Day', fil: 'Araw ng Pista sa Barangay' }, grade: 'G3', competency: 'Comprehension', status: 'published', date: { en: 'Jun 12, 2026', fil: 'Hun 12, 2026' }, source: 'teacher' },
  { title: { en: 'Counting Mangoes', fil: 'Pagbilang ng Mangga' }, grade: 'G1', competency: 'Vocabulary', status: 'pending', date: { en: 'Jul 14, 2026', fil: 'Hul 14, 2026' }, source: 'ai' },
  { title: { en: 'The Lost Slipper', fil: 'Ang Nawawalang Tsinelas' }, grade: 'G2', competency: 'Fluency', status: 'revision', date: { en: 'Jul 9, 2026', fil: 'Hul 9, 2026' }, source: 'teacher' },
  { title: { en: 'Weather Watchers', fil: 'Mga Tagamasid ng Panahon' }, grade: 'G4', competency: 'Comprehension', status: 'published', date: { en: 'May 30, 2026', fil: 'Mayo 30, 2026' }, source: 'ai' },
]

export const UPLOAD_STATUS_LABEL = {
  en: { published: 'Published', pending: 'Pending Review', revision: 'Needs Revision' },
  fil: { published: 'Nailathala', pending: 'Naghihintay ng Review', revision: 'Kailangan ng Ayos' },
}
export const UPLOAD_STATUS_COLOR = { published: '#29B6A4', pending: '#F5A623', revision: '#F04E37' }
export const UPLOAD_STATUS_TINT = { published: '#DFF6F1', pending: '#FEEFCB', revision: '#FFE0D8' }

export const DEMO_REPORT_SUMMARY = {
  en: [
    { title: 'Class Average', big: '79', unit: '%', icon: '📈', color: '#F04E37', tint: '#FFE0D8' },
    { title: 'Completion Rate', big: '86', unit: '%', icon: '✅', color: '#29B6A4', tint: '#DFF6F1' },
    { title: 'Learners Tracked', big: '32', unit: 'learners', icon: '👩‍🏫', color: '#7A6CF0', tint: '#E3DEFF' },
  ],
  fil: [
    { title: 'Average ng Klase', big: '79', unit: '%', icon: '📈', color: '#F04E37', tint: '#FFE0D8' },
    { title: 'Rate ng Pagkumpleto', big: '86', unit: '%', icon: '✅', color: '#29B6A4', tint: '#DFF6F1' },
    { title: 'Mga Mag-aaral', big: '32', unit: 'mag-aaral', icon: '👩‍🏫', color: '#7A6CF0', tint: '#E3DEFF' },
  ],
}

export const DEMO_REPORT_TYPES = {
  en: [
    { icon: '📈', label: 'Learner Progress Report' },
    { icon: '📋', label: 'Intervention Summary' },
    { icon: '🏫', label: 'Class Performance Report' },
    { icon: '🎯', label: 'ARAL Accomplishment Report' },
  ],
  fil: [
    { icon: '📈', label: 'Ulat ng Progreso ng Mag-aaral' },
    { icon: '📋', label: 'Buod ng Interbensyon' },
    { icon: '🏫', label: 'Ulat ng Performance ng Klase' },
    { icon: '🎯', label: 'ARAL Accomplishment Report' },
  ],
}
