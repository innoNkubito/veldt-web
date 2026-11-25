'use client'

import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { FieldInput, FieldSelect } from '@/components/itineraries/shared/FieldPrimitives'
import { AMOUNT_TYPE_LABELS } from '@/stores/bookingStore'
import { BUILDER_SECTION } from '@/lib/builderSections'
import { keysOf, parseOption } from '@/lib/guards'
import type { ConfigCardProps } from '../BookingSection.types'
import { useScheduleEditor } from '../useScheduleEditor'
import * as S from '../BookingSection.styled'

interface ScheduleCardProps extends ConfigCardProps {
  isTemplate: boolean
}

/** What the client pays, and when. The first payment is always due at booking. */
export default function ScheduleCard({ config, currency, saving, isTemplate }: ScheduleCardProps) {
  const s = useScheduleEditor(config, isTemplate, currency)
  const configSaved = config != null

  return (
    <S.Card id={BUILDER_SECTION.bookingSchedule}>
      <S.CardTitleRow>
        <S.CardTitle>Payment Schedule</S.CardTitle>
        <ActionButton $variant="outline" $disabled={!configSaved} onClick={() => configSaved && s.addRow()}>
          + Add Payment
        </ActionButton>
      </S.CardTitleRow>

      <S.CardHint>
        The first payment is always due at booking. Later payments can be a fixed amount, a percentage of the
        total, or whatever balance remains.
        {isTemplate &&
          ' On a template, later payments are due a number of days before the trip starts; ' +
            'they become real dates when an itinerary is created with a start date.'}
      </S.CardHint>

      {!configSaved ? (
        <S.EmptyRow>Save your booking settings below to set up a payment schedule.</S.EmptyRow>
      ) : s.schedule.length === 0 ? (
        <S.EmptyRow>Required — add at least the payment due at booking, then Save Schedule.</S.EmptyRow>
      ) : (
        <>
          <S.ScheduleHeaderRow>
            <S.ScheduleHeaderCell>#</S.ScheduleHeaderCell>
            <S.ScheduleHeaderCell>Description</S.ScheduleHeaderCell>
            <S.ScheduleHeaderCell>{isTemplate ? 'Days before trip' : 'Due'}</S.ScheduleHeaderCell>
            <S.ScheduleHeaderCell>Amount Type</S.ScheduleHeaderCell>
            <S.ScheduleHeaderCell>Amount</S.ScheduleHeaderCell>
            <S.ScheduleHeaderCell />
          </S.ScheduleHeaderRow>

          {s.schedule.map((row, index) => (
            <S.ScheduleRow key={index}>
              <S.ScheduleIndex>{index + 1}</S.ScheduleIndex>

              <FieldInput
                aria-label={`Payment ${index + 1} description`}
                value={row.description}
                onChange={(e) => s.updateRow(index, { description: e.target.value })}
                placeholder="e.g. Deposit"
              />

              {index === 0 ? (
                <S.ScheduleLockNote>At booking</S.ScheduleLockNote>
              ) : isTemplate ? (
                <FieldInput
                  aria-label={`Payment ${index + 1} days before the trip`}
                  type="number"
                  step={1}
                  value={row.dueDays}
                  placeholder="e.g. 60"
                  title="Days before the trip starts. Use a negative number for after."
                  onChange={(e) => s.updateRow(index, { dueDays: e.target.value })}
                />
              ) : (
                <FieldInput
                  aria-label={`Payment ${index + 1} due date`}
                  type="date"
                  value={row.dueDate}
                  onChange={(e) => s.updateRow(index, { dueDate: e.target.value })}
                />
              )}

              <FieldSelect
                aria-label={`Payment ${index + 1} amount type`}
                value={row.amountType}
                onChange={(e) =>
                  s.updateRow(index, {
                    amountType: parseOption(keysOf(AMOUNT_TYPE_LABELS), e.target.value) ?? row.amountType,
                    ...(e.target.value === 'REMAINING_BALANCE' ? { amountValue: '' } : {}),
                  })
                }
              >
                {keysOf(AMOUNT_TYPE_LABELS).map((key) => (
                  <option key={key} value={key}>
                    {AMOUNT_TYPE_LABELS[key]}
                  </option>
                ))}
              </FieldSelect>

              {row.amountType === 'REMAINING_BALANCE' ? (
                <S.ScheduleLockNote>Whatever remains</S.ScheduleLockNote>
              ) : (
                <FieldInput
                  aria-label={`Payment ${index + 1} amount`}
                  type="number"
                  min={0}
                  step="0.01"
                  value={row.amountValue}
                  onChange={(e) => s.updateRow(index, { amountValue: e.target.value })}
                  placeholder={row.amountType === 'PERCENT_OF_TOTAL' ? '%' : currency}
                />
              )}

              <S.LinkButton $danger aria-label={`Remove payment ${index + 1}`} onClick={() => s.removeRow(index)}>
                ✕
              </S.LinkButton>
            </S.ScheduleRow>
          ))}

          <S.ScheduleTotalRow $valid={s.summary.valid}>{s.summary.text}</S.ScheduleTotalRow>

          <S.SaveBar>
            {s.dirty && <S.DirtyNote>Unsaved schedule changes</S.DirtyNote>}
            <ActionButton
              $variant="primary"
              $disabled={saving || !s.dirty}
              onClick={() => s.dirty && !saving && s.save()}
            >
              {saving ? 'Saving…' : 'Save Schedule'}
            </ActionButton>
          </S.SaveBar>
        </>
      )}
    </S.Card>
  )
}
