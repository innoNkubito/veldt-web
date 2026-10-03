'use client'

import * as S from './OperatorContactCard.styled'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { Field, FieldInput, FieldLabel } from '@/components/itineraries/shared/FieldPrimitives'
import { useOperatorContactCard } from './useOperatorContactCard'
import { COPY, FIELDS } from './OperatorContactCard.constants'
import type { OperatorContactCardProps } from './OperatorContactCard.types'

/** The phone, WhatsApp and email travellers see on their dashboard. */
export default function OperatorContactCard({ canEdit }: OperatorContactCardProps) {
  const card = useOperatorContactCard()

  return (
    <S.Section>
      <S.Label>{COPY.label}</S.Label>
      <S.Card>
        <S.Grid>
          {FIELDS.map((field) => (
            <Field key={field.key}>
              <FieldLabel htmlFor={`operator-${field.key}`}>{field.label}</FieldLabel>
              {canEdit ? (
                <FieldInput
                  id={`operator-${field.key}`}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={card.values[field.key]}
                  onChange={(e) => card.setField(field.key, e.target.value)}
                />
              ) : (
                <S.Value>{card.values[field.key] || COPY.notSet}</S.Value>
              )}
            </Field>
          ))}
        </S.Grid>
        {canEdit && (
          <S.Footer>
            <ActionButton
              $variant="primary"
              onClick={card.save}
              $disabled={!card.dirty || card.saving}
              disabled={!card.dirty || card.saving}
            >
              {card.saving ? COPY.saving : COPY.save}
            </ActionButton>
            {card.error && <S.Status $error>{card.error}</S.Status>}
            {card.saved && !card.error && <S.Status>{COPY.saved}</S.Status>}
          </S.Footer>
        )}
      </S.Card>
      <S.Hint>{COPY.hint}</S.Hint>
    </S.Section>
  )
}
