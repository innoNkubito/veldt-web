'use client'

import { Field, FieldInput, FieldLabel, FieldSelect } from '@/components/itineraries/shared/FieldPrimitives'
import { parseOption } from '@/lib/guards'
import type { ProcessorConnection } from '@/stores/integrationsStore'
import { SURCHARGE_PAYERS } from '../BookingSection.constants'
import type { SettingsCardProps } from '../BookingSection.types'
import * as S from '../BookingSection.styled'

interface CardPaymentsCardProps extends SettingsCardProps {
  selectedConnection: ProcessorConnection | null
  processorName: string
}

/** Card payments with an optional surcharge, and ACH where the processor supports it. */
export default function CardPaymentsCard({ form, setF, selectedConnection, processorName }: CardPaymentsCardProps) {
  return (
    <S.Card>
      <S.CardTitleRow>
        <S.CardTitle>Card &amp; Alternative Payments</S.CardTitle>
      </S.CardTitleRow>

      <S.ToggleRow>
        <input
          type="checkbox"
          checked={form.allowCardPayments}
          onChange={(e) => setF('allowCardPayments', e.target.checked)}
        />
        <S.ToggleLabelText>
          Allow card payments
          <S.ToggleHint>Lets clients pay installments by credit or debit card.</S.ToggleHint>
        </S.ToggleLabelText>
      </S.ToggleRow>

      {form.allowCardPayments && (
        <>
          <S.Spacer />
          <S.Grid>
            <Field>
              <FieldLabel htmlFor="booking-surcharge-payer">Who Covers the Surcharge</FieldLabel>
              <FieldSelect
                id="booking-surcharge-payer"
                value={form.surchargePayer}
                onChange={(e) =>
                  setF('surchargePayer', parseOption(SURCHARGE_PAYERS, e.target.value) ?? form.surchargePayer)
                }
              >
                <option value="CLIENT">Client covers the surcharge</option>
                <option value="OPERATOR">We cover the surcharge</option>
              </FieldSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="booking-surcharge">Surcharge %</FieldLabel>
              <FieldInput
                id="booking-surcharge"
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={form.surchargePercent}
                onChange={(e) => setF('surchargePercent', e.target.value)}
                placeholder="e.g. 3"
              />
            </Field>
          </S.Grid>
          <S.Spacer />
          <S.Callout $tone="warn">
            Credit card surcharging is regulated differently by region and by card. It&apos;s your
            responsibility to ensure it is permitted. This surcharging solution is only possible if card payments
            are not enabled directly in {processorName}.
          </S.Callout>
        </>
      )}

      <S.ToggleRow>
        <input
          type="checkbox"
          checked={form.achEnabled}
          disabled={!selectedConnection?.supportsAch}
          onChange={(e) => setF('achEnabled', e.target.checked)}
        />
        <S.ToggleLabelText>
          Enable ACH / bank transfer
          <S.ToggleHint>
            {selectedConnection?.supportsAch
              ? 'Offers bank transfer alongside card payments.'
              : 'Unavailable — the selected processor connection does not support ACH.'}
          </S.ToggleHint>
        </S.ToggleLabelText>
      </S.ToggleRow>
    </S.Card>
  )
}
