'use client'

import * as S from './RemoveMemberModal.styled'
import { useRemoveMemberModal } from './useRemoveMemberModal'
import { COPY } from './RemoveMemberModal.constants'
import { memberLabel } from './RemoveMemberModal.utils'
import type { RemoveMemberModalProps } from './RemoveMemberModal.types'

/** Confirms a removal and chooses who takes over the member's work. */
export default function RemoveMemberModal({
  member,
  members,
  onClose,
  onDone,
}: RemoveMemberModalProps) {
  const modal = useRemoveMemberModal({ member, members, onDone })

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(event) => event.stopPropagation()}>
        <S.ModalTitle>
          {COPY.title}: {memberLabel(member)}
        </S.ModalTitle>
        <S.ModalSub>{COPY.sub}</S.ModalSub>

        {modal.error && <S.ResultLine $ok={false}>{modal.error}</S.ResultLine>}

        <S.FieldGroup>
          <S.FieldLabel htmlFor="remove-handover">{COPY.recipientLabel}</S.FieldLabel>
          <S.Select
            id="remove-handover"
            value={modal.reassignToId}
            onChange={(event) => modal.setReassignToId(event.target.value)}
          >
            {modal.candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {memberLabel(candidate)} {candidate.isYou ? COPY.you : ''}
              </option>
            ))}
          </S.Select>
          <S.Note>{COPY.recipientNote}</S.Note>
        </S.FieldGroup>

        <S.ModalActions>
          <S.GhostButton type="button" onClick={onClose} disabled={modal.saving}>
            {COPY.cancel}
          </S.GhostButton>
          <S.DangerButton
            type="button"
            onClick={modal.remove}
            disabled={modal.saving || !modal.reassignToId}
          >
            {modal.saving ? COPY.removing : COPY.remove}
          </S.DangerButton>
        </S.ModalActions>
      </S.Modal>
    </S.Overlay>
  )
}
