import { TABS } from './page.constants'
import type { BuilderTab } from './page.types'

/** The trip is run from CONFIRMED on; before that it is still a proposal. */
export function showsTripTab(status: string | undefined): boolean {
  return status === 'CONFIRMED' || status === 'TRAVELLING' || status === 'COMPLETED'
}

export function visibleTabs(status: string | undefined) {
  return TABS.filter((t) => t.key !== 'trip' || showsTripTab(status))
}

/** Undoing a confirmation hides the Trip tab; fall back rather than render nothing. */
export function resolveTab(active: BuilderTab, status: string | undefined): BuilderTab {
  return active === 'trip' && !showsTripTab(status) ? 'overview' : active
}

export function shareLinkUrl(origin: string, slug: string): string {
  return `${origin}/view/${slug}`
}

/** "3 days · 12 views" */
export function headerStats(days: number, views: number): string {
  return `${days} days · ${views} views`
}

/** A template has no client, dates or views — just its days. */
export function templateStats(days: number): string {
  return `${days} ${days === 1 ? 'day' : 'days'}`
}
