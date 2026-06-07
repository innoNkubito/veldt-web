'use client'

import { useState } from 'react'
import { ItineraryRow } from '@/stores/builderStore'
import {
  Field,
  FieldLabel,
  FieldInput,
  SmallButton,
} from '@/components/itineraries/shared/FieldPrimitives'
import * as S from './RowForm.styled'

export interface RowFormData {
  dateLabel?: string
  numNights?: number
  transfersText?: string
}

interface Props {
  initial?: Partial<ItineraryRow>
  onSave: (data: RowFormData) => void
  onCancel: () => void
}

export default function RowForm({ initial, onSave, onCancel }: Props) {
  const [dateLabel, setDateLabel] = useState(initial?.dateLabel ?? '')
  const [numNights, setNumNights] = useState(
    initial?.numNights != null ? String(initial.numNights) : '',
  )
  const [transfersText, setTransfersText] = useState(initial?.transfersText ?? '')

  return (
    <S.Root>
      <S.Grid>
        <Field>
          <FieldLabel>Day / Date Label</FieldLabel>
          <FieldInput
            value={dateLabel}
            onChange={(e) => setDateLabel(e.target.value)}
            placeholder="e.g. Day 1 · May 15"
          />
        </Field>
        <Field>
          <FieldLabel>Nights</FieldLabel>
          <FieldInput
            type="number"
            min={0}
            value={numNights}
            onChange={(e) => setNumNights(e.target.value)}
            placeholder="e.g. 2"
          />
        </Field>
        <Field>
          <FieldLabel>Transfers / Movement</FieldLabel>
          <FieldInput
            value={transfersText}
            onChange={(e) => setTransfersText(e.target.value)}
            placeholder="e.g. Fly Nairobi → Maasai Mara"
          />
        </Field>
      </S.Grid>
      <S.Actions>
        <SmallButton onClick={onCancel}>Cancel</SmallButton>
        <SmallButton
          $primary
          onClick={() =>
            onSave({
              dateLabel: dateLabel || undefined,
              numNights: numNights ? parseInt(numNights) : undefined,
              transfersText: transfersText || undefined,
            })
          }
        >
          {initial?.id ? 'Save Row' : 'Add Row'}
        </SmallButton>
      </S.Actions>
    </S.Root>
  )
}
