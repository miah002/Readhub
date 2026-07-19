import { Badge } from './badge'
import { LEVEL_COLOR, LEVEL_TINT } from '@/lib/level-colors'
import type { Level } from '@/lib/types'

interface LevelBadgeProps {
  level: Level
  label: string
}

export function LevelBadge({ level, label }: LevelBadgeProps) {
  return <Badge style={{ color: LEVEL_COLOR[level], background: LEVEL_TINT[level] }}>{label}</Badge>
}
