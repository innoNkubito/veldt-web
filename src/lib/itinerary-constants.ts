import { T } from '@/lib/theme'

export type StatusTab =
  | 'ALL'
  | 'DRAFT'
  | 'PUBLISHED'
  | 'CONFIRMED'
  | 'TRAVELLING'
  | 'COMPLETED'
  | 'ARCHIVED'

export const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'DRAFT', label: 'Drafts' },
  { key: 'PUBLISHED', label: 'Published' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'TRAVELLING', label: 'Travelling' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'ARCHIVED', label: 'Archived' },
]

export const STATUS_META: Record<string, { color: string; bg: string }> = {
  DRAFT: { color: T.muted, bg: T.dim },
  PUBLISHED: { color: T.teal, bg: T.tealLt },
  CONFIRMED: { color: T.sage, bg: T.sageLt },
  TRAVELLING: { color: T.terra, bg: T.terraLt },
  COMPLETED: { color: T.gold, bg: T.goldLt },
  ARCHIVED: { color: T.muted, bg: T.dim },
}
