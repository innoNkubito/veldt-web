import type { ProofStat } from './types'

// Ease-out so the count settles rather than stopping dead.
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export function formatStat(stat: ProofStat, progress: number): string {
  const current = Math.round(stat.value * progress)
  return `${stat.prefix ?? ''}${current.toLocaleString('en-US')}${stat.suffix ?? ''}`
}
