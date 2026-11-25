'use client'

import { Field, FieldInput, FieldLabel } from '@/components/itineraries/shared/FieldPrimitives'
import { BUILDER_SECTION } from '@/lib/builderSections'
import { BOOKING_OPENS_HINT, MODES } from '../BookingSection.constants'
import type { SettingsCardProps } from '../BookingSection.types'
import * as S from '../BookingSection.styled'

/** Off, through Veldt, or an external link — and the link/contact for the last. */
export default function ModeCard({ form, setF }: SettingsCardProps) {
  return (
    <S.Card id={BUILDER_SECTION.bookingMode}>
      <S.CardTitleRow>
        <S.CardTitle>Make Bookable</S.CardTitle>
      </S.CardTitleRow>
      <S.CardHint>{BOOKING_OPENS_HINT}</S.CardHint>

      <S.ModeRow>
        {MODES.map((mode) => (
          <S.ModeCard
            key={mode.key}
            type="button"
            aria-pressed={form.bookingMode === mode.key}
            $active={form.bookingMode === mode.key}
            onClick={() => setF('bookingMode', mode.key)}
          >
            <S.ModeName $active={form.bookingMode === mode.key}>{mode.name}</S.ModeName>
            <S.ModeDesc>{mode.desc}</S.ModeDesc>
          </S.ModeCard>
        ))}
      </S.ModeRow>

      {form.bookingMode === 'EXTERNAL' && (
        <>
          <S.Spacer />
          <S.Grid>
            <Field>
              <FieldLabel htmlFor="booking-external-url">Booking Link</FieldLabel>
              <FieldInput
                id="booking-external-url"
                value={form.externalUrl}
                onChange={(e) => setF('externalUrl', e.target.value)}
                placeholder="https://…"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="booking-external-contact">Or Contact Info</FieldLabel>
              <FieldInput
                id="booking-external-contact"
                value={form.externalContact}
                onChange={(e) => setF('externalContact', e.target.value)}
                placeholder="e.g. bookings@example.com"
              />
            </Field>
          </S.Grid>
        </>
      )}
    </S.Card>
  )
}
