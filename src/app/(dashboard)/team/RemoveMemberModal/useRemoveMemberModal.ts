import { useState } from 'react'
import { useTeamStore } from '@/stores/teamStore'
import { handoverCandidates, handoverMessage, memberLabel } from './RemoveMemberModal.utils'
import type { RemoveMemberModalProps } from './RemoveMemberModal.types'

/** Picks who inherits the member's work, then removes them. */
export function useRemoveMemberModal({
  member,
  members,
  onDone,
}: Pick<RemoveMemberModalProps, 'member' | 'members' | 'onDone'>) {
  const removeMember = useTeamStore((s) => s.removeMember)
  const saving = useTeamStore((s) => s.saving)
  const error = useTeamStore((s) => s.error)

  const candidates = handoverCandidates(members, member.id)
  // The owner doing the removal is the natural default — they are always eligible.
  const [reassignToId, setReassignToId] = useState(
    candidates.find((m) => m.isYou)?.id ?? candidates[0]?.id ?? '',
  )

  async function remove() {
    if (!reassignToId) return
    const handover = await removeMember(member.id, reassignToId)
    if (!handover) return
    const recipient = candidates.find((m) => m.id === reassignToId)
    onDone(handoverMessage(memberLabel(member), recipient ? memberLabel(recipient) : 'you', handover))
  }

  return { candidates, reassignToId, setReassignToId, saving, error, remove }
}
