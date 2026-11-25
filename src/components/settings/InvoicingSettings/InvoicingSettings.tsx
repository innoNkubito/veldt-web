'use client'

import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { Field, FieldInput, FieldLabel, FieldTextarea } from '@/components/itineraries/shared/FieldPrimitives'
import HtmlRichTextEditor from '@/components/itineraries/HtmlRichTextEditor'
import { COPY, MAX_PREFIX } from './InvoicingSettings.constants'
import { useInvoicingSettings } from './useInvoicingSettings'
import * as S from './InvoicingSettings.styled'

/** Settings → Invoicing: who the invoices are from, how they're numbered, and their defaults. */
export default function InvoicingSettings() {
  const v = useInvoicingSettings()

  if (v.loading) return <S.Card>{COPY.loading}</S.Card>
  if (v.error && !v.settings) return <S.Card><S.Notice $error>{v.error}</S.Notice></S.Card>

  const readOnly = !v.canEdit
  const { form } = v

  return (
    <S.Card>
      <S.Intro>{COPY.intro}</S.Intro>
      {readOnly && <S.Muted>{COPY.readOnly}</S.Muted>}

      <S.Grid>
        <Field>
          <FieldLabel htmlFor="inv-legal-name">{COPY.legalName}</FieldLabel>
          <FieldInput
            id="inv-legal-name"
            value={form.legalName}
            disabled={readOnly}
            placeholder={v.settings?.operatorName}
            onChange={(e) => v.set('legalName', e.target.value)}
          />
          {v.settings && <S.Hint>{COPY.legalNameHint(v.settings.operatorName)}</S.Hint>}
        </Field>
        <Field>
          <FieldLabel htmlFor="inv-tax-id">{COPY.taxId}</FieldLabel>
          <FieldInput
            id="inv-tax-id"
            value={form.taxId}
            disabled={readOnly}
            placeholder={COPY.taxIdPlaceholder}
            onChange={(e) => v.set('taxId', e.target.value)}
          />
        </Field>
        <S.Full>
          <Field>
            <FieldLabel htmlFor="inv-address">{COPY.address}</FieldLabel>
            <FieldTextarea
              id="inv-address"
              rows={3}
              value={form.address}
              disabled={readOnly}
              placeholder={COPY.addressPlaceholder}
              onChange={(e) => v.set('address', e.target.value)}
            />
          </Field>
        </S.Full>
        <S.Full>
          <Field>
            <FieldLabel htmlFor="inv-bank">{COPY.bank}</FieldLabel>
            <FieldTextarea
              id="inv-bank"
              rows={3}
              value={form.bankDetails}
              disabled={readOnly}
              onChange={(e) => v.set('bankDetails', e.target.value)}
            />
            <S.Hint>{COPY.bankHint}</S.Hint>
          </Field>
        </S.Full>
        <Field>
          <FieldLabel htmlFor="inv-prefix">{COPY.prefix}</FieldLabel>
          <FieldInput
            id="inv-prefix"
            value={form.numberPrefix}
            maxLength={MAX_PREFIX}
            disabled={readOnly}
            onChange={(e) => v.set('numberPrefix', e.target.value.toUpperCase())}
            aria-describedby="inv-prefix-preview"
          />
          <S.Hint>{COPY.prefixHint}</S.Hint>
          <S.Preview id="inv-prefix-preview">
            {COPY.nextNumber}
            <strong>{v.preview}</strong>
          </S.Preview>
        </Field>
      </S.Grid>

      <S.Divider />
      <S.Muted>{COPY.defaultsHint}</S.Muted>

      <Field>
        <FieldLabel>{COPY.notes}</FieldLabel>
        {readOnly ? (
          <S.ReadOnlyHtml>
            {form.defaultNotes ? <div dangerouslySetInnerHTML={{ __html: form.defaultNotes }} /> : <S.Empty>{COPY.none}</S.Empty>}
          </S.ReadOnlyHtml>
        ) : (
          <HtmlRichTextEditor
            content={form.defaultNotes}
            onChange={(html) => v.set('defaultNotes', html)}
            placeholder={COPY.notesPlaceholder}
          />
        )}
      </Field>
      <S.Divider />
      <Field>
        <FieldLabel>{COPY.terms}</FieldLabel>
        {readOnly ? (
          <S.ReadOnlyHtml>
            {form.defaultTerms ? <div dangerouslySetInnerHTML={{ __html: form.defaultTerms }} /> : <S.Empty>{COPY.none}</S.Empty>}
          </S.ReadOnlyHtml>
        ) : (
          <HtmlRichTextEditor
            content={form.defaultTerms}
            onChange={(html) => v.set('defaultTerms', html)}
            placeholder={COPY.termsPlaceholder}
          />
        )}
      </Field>

      {!readOnly && (
        <S.Footer>
          {v.message ? (
            <S.Notice $error={v.message.error} role="status">
              {v.message.text}
            </S.Notice>
          ) : (
            v.dirty && <S.Dirty>{COPY.unsaved}</S.Dirty>
          )}
          <ActionButton
            $variant="primary"
            onClick={v.submit}
            disabled={v.saving || !v.dirty}
            $disabled={v.saving || !v.dirty}
          >
            {v.saving ? COPY.saving : COPY.save}
          </ActionButton>
        </S.Footer>
      )}
    </S.Card>
  )
}
