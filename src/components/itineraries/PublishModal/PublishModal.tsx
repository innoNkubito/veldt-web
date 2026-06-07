'use client'

import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import * as S from './PublishModal.styled'

interface Props {
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}

export default function PublishModal({ onConfirm, onCancel, loading }: Props) {
  return (
    <S.Overlay onClick={onCancel}>
      <S.Card onClick={(e) => e.stopPropagation()}>
        <S.Title>Publish Itinerary?</S.Title>
        <S.Body>
          Publishing will make this itinerary accessible via its share link. Clients will be able
          to view it, and view count tracking will begin.
          <br />
          <br />
          Make sure all costs are confirmed and content is finalised before publishing.
        </S.Body>
        <S.Actions>
          <ActionButton onClick={onCancel}>Cancel</ActionButton>
          <ActionButton $variant="primary" onClick={onConfirm} $disabled={loading}>
            {loading ? 'Publishing…' : 'Publish Now'}
          </ActionButton>
        </S.Actions>
      </S.Card>
    </S.Overlay>
  )
}
