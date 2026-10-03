'use client'

import * as S from './StartTripModal.styled'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { CheckboxRow } from '@/components/itineraries/shared/FieldPrimitives'
import { useStartTripModal } from './useStartTripModal'
import { COPY } from './StartTripModal.constants'
import type { StartTripModalProps } from './StartTripModal.types'

/** Releases the travel dashboard, optionally emailing the traveller the link. */
export default function StartTripModal(props: StartTripModalProps) {
  const { notifyTraveller, setNotifyTraveller, submitting, error, confirm } = useStartTripModal(props)

  return (
    <S.Overlay onClick={props.onCancel}>
      <S.Card onClick={(e) => e.stopPropagation()}>
        <S.Title>{COPY.title}</S.Title>
        <S.Body>{COPY.body}</S.Body>

        {props.travellerEmail && (
          <CheckboxRow>
            <input
              type="checkbox"
              checked={notifyTraveller}
              onChange={(e) => setNotifyTraveller(e.target.checked)}
            />
            {COPY.notify(props.travellerEmail)}
          </CheckboxRow>
        )}

        {error && <S.ErrorText>{error}</S.ErrorText>}

        <S.Actions>
          <ActionButton onClick={props.onCancel}>{COPY.cancel}</ActionButton>
          <ActionButton $variant="primary" onClick={confirm} $disabled={submitting} disabled={submitting}>
            {submitting ? COPY.confirming : COPY.confirm}
          </ActionButton>
        </S.Actions>
      </S.Card>
    </S.Overlay>
  )
}
