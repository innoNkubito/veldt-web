import type { TeamMember } from '@/stores/teamStore'

export interface RemoveMemberModalProps {
  /** The person being removed. */
  member: TeamMember
  /** The whole team — the candidates to take over are drawn from it. */
  members: TeamMember[]
  onClose: () => void
  /** Called after a successful removal with the line to show on the page. */
  onDone: (message: string) => void
}
