import type { RemovalHandover, TeamMember } from '@/stores/teamStore'
import { HANDOVER_ROLES } from './RemoveMemberModal.constants'

/** Name if there is one, else email. */
export function memberLabel(member: TeamMember): string {
  const name = [member.firstName, member.lastName].filter(Boolean).join(' ').trim()
  return name || member.email || 'Unnamed member'
}

/** Colleagues who may take over: owners and advisors, never the person leaving. */
export function handoverCandidates(members: TeamMember[], removedId: string): TeamMember[] {
  return members.filter((m) => m.id !== removedId && HANDOVER_ROLES.includes(m.role))
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

/** The page notice after removal — says what moved, or that nothing did. */
export function handoverMessage(
  removed: string,
  recipient: string,
  handover: RemovalHandover,
): string {
  const parts = [
    handover.itineraries > 0 && plural(handover.itineraries, 'itinerary', 'itineraries'),
    handover.aboutUsPages > 0 && plural(handover.aboutUsPages, 'About Us page', 'About Us pages'),
    handover.tasks > 0 && plural(handover.tasks, 'open task', 'open tasks'),
  ].filter((part): part is string => typeof part === 'string')

  return parts.length > 0
    ? `${removed} was removed. ${parts.join(', ')} moved to ${recipient}.`
    : `${removed} was removed. They had no assigned work to hand over.`
}
