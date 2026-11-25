'use client'

import { Field, FieldInput, FieldLabel, FieldSelect, FieldTextarea } from '@/components/itineraries/shared/FieldPrimitives'
import HtmlRichTextEditor from '@/components/itineraries/HtmlRichTextEditor'
import { BUILDER_SECTION } from '@/lib/builderSections'
import { parseOption } from '@/lib/guards'
import { CURRENCY_HINT, FLOW_TYPES } from '../BookingSection.constants'
import type { ProcessorProps, SettingsCardProps } from '../BookingSection.types'
import * as S from '../BookingSection.styled'

interface SettingsCardOwnProps extends SettingsCardProps, ProcessorProps {
  currency: string
}

/** Processor, currency, booking flow, and what the client reads and accepts. */
export default function SettingsCard({
  form,
  setF,
  currency,
  activeConnections,
  selectedConnection,
}: SettingsCardOwnProps) {
  return (
    <S.Card>
      <S.CardTitleRow>
        <S.CardTitle>Payment Settings</S.CardTitle>
      </S.CardTitleRow>

      {selectedConnection?.environment === 'TEST' && (
        <S.Callout $tone="warn">
          <strong>{selectedConnection.label}</strong> is a test/sandbox connection — no real money moves and
          payments always succeed. Switch to a live connection before sending this itinerary to a client.
        </S.Callout>
      )}

      <S.Grid>
        <Field id={BUILDER_SECTION.bookingProcessor}>
          <FieldLabel htmlFor="booking-processor">Payment Processor</FieldLabel>
          <FieldSelect
            id="booking-processor"
            value={form.processorConnectionId}
            onChange={(e) => setF('processorConnectionId', e.target.value)}
          >
            <option value="">No processor selected</option>
            {activeConnections.map((connection) => (
              <option key={connection.id} value={connection.id}>
                {connection.label}
                {connection.environment === 'TEST' ? ' (Test)' : ''}
              </option>
            ))}
          </FieldSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="booking-currency">Currency</FieldLabel>
          <FieldInput id="booking-currency" value={currency} readOnly disabled />
          <S.ToggleHint>{CURRENCY_HINT}</S.ToggleHint>
        </Field>
        <S.FullRow>
          <Field>
            <FieldLabel htmlFor="booking-flow">Booking Flow</FieldLabel>
            <FieldSelect
              id="booking-flow"
              value={form.flowType}
              onChange={(e) => setF('flowType', parseOption(FLOW_TYPES, e.target.value) ?? form.flowType)}
            >
              <option value="INSTANT">Instant — client pays the first payment at booking</option>
              <option value="REQUEST">Request — you review, then send an invoice</option>
            </FieldSelect>
          </Field>
        </S.FullRow>
        <S.FullRow>
          <Field>
            <FieldLabel htmlFor="booking-company">Company Info</FieldLabel>
            <FieldTextarea
              id="booking-company"
              value={form.companyInfo}
              onChange={(e) => setF('companyInfo', e.target.value)}
              placeholder="Legal name, address, tax/VAT number — shown on invoices"
            />
          </Field>
        </S.FullRow>
      </S.Grid>

      <S.Spacer />
      <FieldLabel>Invoice Notes</FieldLabel>
      <HtmlRichTextEditor
        content={form.invoiceNotes}
        onChange={(html) => setF('invoiceNotes', html)}
        placeholder="Notes shown on the invoice…"
      />

      <S.Spacer />
      <FieldLabel>Terms &amp; Conditions</FieldLabel>
      <HtmlRichTextEditor
        content={form.termsAndConditions}
        onChange={(html) => setF('termsAndConditions', html)}
        placeholder="Booking terms clients accept at checkout…"
      />
    </S.Card>
  )
}
