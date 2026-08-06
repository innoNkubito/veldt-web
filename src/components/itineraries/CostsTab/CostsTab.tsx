'use client'

import { useEffect, useState } from 'react'
import { T } from '@/lib/theme'
import { useBuilderStore } from '@/stores/builderStore'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import {
  Field,
  FieldLabel,
  FieldInput,
  FieldSelect,
  CheckboxRow,
} from '@/components/itineraries/shared/FieldPrimitives'
import HtmlRichTextEditor from '@/components/itineraries/HtmlRichTextEditor'
import * as S from './CostsTab.styled'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'ZAR', 'KES', 'TZS']

export default function CostsTab() {
  const { itinerary, upsertCosts, saving } = useBuilderStore()
  const existing = itinerary?.costs

  const [form, setForm] = useState({
    pricePerPerson: existing?.pricePerPerson != null ? String(existing.pricePerPerson) : '',
    numGuests: existing?.numGuests != null ? String(existing.numGuests) : '2',
    accommodationType: existing?.accommodationType ?? '',
    currency: existing?.currency ?? 'USD',
    costsToBeDetetermined: existing?.costsToBeDetetermined ?? false,
    costIncludes: existing?.costIncludes ?? '',
    costExcludes: existing?.costExcludes ?? '',
    costNotes: existing?.costNotes ?? '',
    notesVisible: existing?.notesVisible ?? false,
    miscText: existing?.miscText ?? '',
    miscVisible: existing?.miscVisible ?? false,
    priceVisible: existing?.priceVisible ?? true,
    accuracyConfirmed: existing?.accuracyConfirmed ?? false,
  })
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (existing) {
      setForm({
        pricePerPerson: existing.pricePerPerson != null ? String(existing.pricePerPerson) : '',
        numGuests: String(existing.numGuests),
        accommodationType: existing.accommodationType ?? '',
        currency: existing.currency,
        costsToBeDetetermined: existing.costsToBeDetetermined,
        costIncludes: existing.costIncludes ?? '',
        costExcludes: existing.costExcludes ?? '',
        costNotes: existing.costNotes ?? '',
        notesVisible: existing.notesVisible,
        miscText: existing.miscText ?? '',
        miscVisible: existing.miscVisible,
        priceVisible: existing.priceVisible,
        accuracyConfirmed: existing.accuracyConfirmed,
      })
      setDirty(false)
    }
  }, [itinerary?.id])

  function setF(key: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
  }

  async function handleSave() {
    if (!itinerary) return
    await upsertCosts(itinerary.id, {
      pricePerPerson: form.pricePerPerson ? parseFloat(form.pricePerPerson) : undefined,
      numGuests: parseInt(form.numGuests) || 2,
      accommodationType: form.accommodationType || undefined,
      currency: form.currency || 'USD',
      costsToBeDetetermined: form.costsToBeDetetermined,
      costIncludes: form.costIncludes || undefined,
      costExcludes: form.costExcludes || undefined,
      costNotes: form.costNotes || undefined,
      notesVisible: form.notesVisible,
      miscText: form.miscText || undefined,
      miscVisible: form.miscVisible,
      priceVisible: form.priceVisible,
      accuracyConfirmed: form.accuracyConfirmed,
    })
    setDirty(false)
  }

  return (
    <div>
      <S.Card>
        <S.CardTitle>Pricing</S.CardTitle>
        <S.Grid>
          <Field>
            <FieldLabel>Price Per Person</FieldLabel>
            <FieldInput
              type="number"
              min={0}
              value={form.pricePerPerson}
              onChange={(e) => setF('pricePerPerson', e.target.value)}
              placeholder="e.g. 4500"
              disabled={form.costsToBeDetetermined}
            />
          </Field>
          <Field>
            <FieldLabel>Currency</FieldLabel>
            <FieldSelect value={form.currency} onChange={(e) => setF('currency', e.target.value)}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </FieldSelect>
          </Field>
          <Field>
            <FieldLabel>Number of Guests</FieldLabel>
            <FieldInput
              type="number"
              min={1}
              value={form.numGuests}
              onChange={(e) => setF('numGuests', e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Accommodation Type</FieldLabel>
            <FieldInput
              value={form.accommodationType}
              onChange={(e) => setF('accommodationType', e.target.value)}
              placeholder="e.g. Luxury tented camps"
            />
          </Field>
          <S.FullRow>
            <CheckboxRow>
              <input
                type="checkbox"
                checked={form.costsToBeDetetermined}
                onChange={(e) => setF('costsToBeDetetermined', e.target.checked)}
              />
              Costs to be determined (hides price on share link)
            </CheckboxRow>
          </S.FullRow>
          <S.FullRow>
            <CheckboxRow>
              <input
                type="checkbox"
                checked={form.priceVisible}
                onChange={(e) => setF('priceVisible', e.target.checked)}
              />
              Show price on client share link
            </CheckboxRow>
          </S.FullRow>
        </S.Grid>
      </S.Card>

      <S.Card>
        <S.CardTitle>Includes &amp; Excludes</S.CardTitle>
        <S.Grid>
          <Field>
            <FieldLabel>Cost Includes</FieldLabel>
            <HtmlRichTextEditor
              content={form.costIncludes}
              onChange={(html) => setF('costIncludes', html)}
              placeholder="All accommodation, internal flights, activities…"
            />
          </Field>
          <Field>
            <FieldLabel>Cost Excludes</FieldLabel>
            <HtmlRichTextEditor
              content={form.costExcludes}
              onChange={(html) => setF('costExcludes', html)}
              placeholder="International airfare, travel insurance, visas…"
            />
          </Field>
          <S.FullRow>
            <FieldLabel>Cost Notes</FieldLabel>
            <HtmlRichTextEditor
              content={form.costNotes}
              onChange={(html) => setF('costNotes', html)}
              placeholder="Validity period, payment schedule, cancellation policy…"
            />
            <CheckboxRow style={{ marginTop: 6 }}>
              <input
                type="checkbox"
                checked={form.notesVisible}
                onChange={(e) => setF('notesVisible', e.target.checked)}
              />
              Show notes on client share link
            </CheckboxRow>
          </S.FullRow>
          <S.FullRow>
            <FieldLabel>Miscellaneous Text</FieldLabel>
            <HtmlRichTextEditor
              content={form.miscText}
              onChange={(html) => setF('miscText', html)}
              placeholder="Any additional pricing information…"
            />
            <CheckboxRow style={{ marginTop: 6 }}>
              <input
                type="checkbox"
                checked={form.miscVisible}
                onChange={(e) => setF('miscVisible', e.target.checked)}
              />
              Show miscellaneous text on client share link
            </CheckboxRow>
          </S.FullRow>
        </S.Grid>
      </S.Card>

      <S.Card>
        <S.CardTitle>Accuracy Confirmation</S.CardTitle>
        <S.ConfirmRow
          $checked={form.accuracyConfirmed}
          onClick={() => setF('accuracyConfirmed', !form.accuracyConfirmed)}
        >
          <S.ConfirmCheckbox
            type="checkbox"
            checked={form.accuracyConfirmed}
            onChange={() => {}}
          />
          I confirm that all pricing and cost information is accurate and up to date.
          {form.accuracyConfirmed && (
            <span style={{ marginLeft: 'auto', fontSize: 11, color: T.sage, fontWeight: 600 }}>
              ✓ Confirmed
            </span>
          )}
        </S.ConfirmRow>
        <S.ConfirmNote>
          Accuracy must be confirmed before publishing. It resets when a cost template is applied.
        </S.ConfirmNote>
      </S.Card>

      {dirty && (
        <S.SaveRow>
          <ActionButton $variant="primary" onClick={handleSave} $disabled={saving}>
            {saving ? 'Saving…' : 'Save Costs'}
          </ActionButton>
        </S.SaveRow>
      )}
    </div>
  )
}
