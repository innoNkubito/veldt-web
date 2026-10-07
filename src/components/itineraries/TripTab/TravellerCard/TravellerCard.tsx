import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { FieldGroup, Field, FieldLabel, FieldInput } from '@/components/itineraries/shared/FieldPrimitives'
import * as TripS from '../TripTab.styled'
import * as S from './TravellerCard.styled'
import { useTravellerCard } from './useTravellerCard'
import { COPY, FIELD_IDS } from './TravellerCard.constants'

/**
 * Traveller contact and trip dates. Once confirmed these cannot be cleared —
 * the API refuses, and the error is shown here.
 */
export default function TravellerCard() {
  const { form, set, dirty, saving, error, save } = useTravellerCard()

  return (
    <TripS.Card>
      <TripS.CardHeader>
        <TripS.CardTitle>{COPY.title}</TripS.CardTitle>
      </TripS.CardHeader>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={FIELD_IDS.email}>{COPY.email}</FieldLabel>
          <FieldInput
            id={FIELD_IDS.email}
            type="email"
            value={form.clientEmail}
            onChange={(e) => set('clientEmail', e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={FIELD_IDS.phone}>{COPY.phone}</FieldLabel>
          <FieldInput
            id={FIELD_IDS.phone}
            type="tel"
            value={form.clientPhone}
            onChange={(e) => set('clientPhone', e.target.value)}
          />
        </Field>
        <S.DateRow>
          <Field>
            <FieldLabel htmlFor={FIELD_IDS.start}>{COPY.starts}</FieldLabel>
            <FieldInput
              id={FIELD_IDS.start}
              type="date"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={FIELD_IDS.end}>{COPY.ends}</FieldLabel>
            <FieldInput
              id={FIELD_IDS.end}
              type="date"
              value={form.endDate}
              min={form.startDate || undefined}
              onChange={(e) => set('endDate', e.target.value)}
            />
          </Field>
        </S.DateRow>
      </FieldGroup>

      {error && <TripS.ErrorText>{error}</TripS.ErrorText>}
      {dirty && (
        <S.CardFooter>
          <ActionButton $variant="primary" onClick={save} $disabled={saving} disabled={saving}>
            {saving ? COPY.saving : COPY.save}
          </ActionButton>
        </S.CardFooter>
      )}
      <S.Hint>{COPY.hint}</S.Hint>
    </TripS.Card>
  )
}
