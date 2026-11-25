'use client'

import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { CheckboxRow, Field, FieldInput, FieldLabel, FieldSelect } from '@/components/itineraries/shared/FieldPrimitives'
import HtmlRichTextEditor from '@/components/itineraries/HtmlRichTextEditor'
import { COPY, CURRENCIES } from './QuoteSection.constants'
import { useQuoteSection } from './useQuoteSection'
import * as S from './QuoteSection.styled'

/** The proposal's quote — the Investment section clients see on the share link. */
export default function QuoteSection() {
  const { form, set, dirty, saving, saveError, save } = useQuoteSection()

  return (
    <div>
      <S.Card>
        <S.CardTitle>{COPY.pricingTitle}</S.CardTitle>
        <S.Grid>
          <Field>
            <FieldLabel htmlFor="quote-price">{COPY.pricePerPerson}</FieldLabel>
            <FieldInput
              id="quote-price"
              type="number"
              min={0}
              value={form.pricePerPerson}
              onChange={(e) => set('pricePerPerson', e.target.value)}
              placeholder={COPY.pricePlaceholder}
              disabled={form.costsToBeDetetermined}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="quote-currency">{COPY.currency}</FieldLabel>
            <FieldSelect id="quote-currency" value={form.currency} onChange={(e) => set('currency', e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </FieldSelect>
            <S.FieldHint>{COPY.currencyHint}</S.FieldHint>
          </Field>
          <Field>
            <FieldLabel htmlFor="quote-guests">{COPY.guests}</FieldLabel>
            <FieldInput
              id="quote-guests"
              type="number"
              min={1}
              value={form.numGuests}
              onChange={(e) => set('numGuests', e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="quote-accommodation">{COPY.accommodation}</FieldLabel>
            <FieldInput
              id="quote-accommodation"
              value={form.accommodationType}
              onChange={(e) => set('accommodationType', e.target.value)}
              placeholder={COPY.accommodationPlaceholder}
            />
          </Field>
          <S.FullRow>
            <CheckboxRow>
              <input
                type="checkbox"
                checked={form.costsToBeDetetermined}
                onChange={(e) => set('costsToBeDetetermined', e.target.checked)}
              />
              {COPY.tbd}
            </CheckboxRow>
          </S.FullRow>
          <S.FullRow>
            <CheckboxRow>
              <input type="checkbox" checked={form.priceVisible} onChange={(e) => set('priceVisible', e.target.checked)} />
              {COPY.priceVisible}
            </CheckboxRow>
          </S.FullRow>
        </S.Grid>
      </S.Card>

      <S.Card>
        <S.CardTitle>{COPY.includesTitle}</S.CardTitle>
        <S.Grid>
          <Field>
            <FieldLabel>{COPY.includes}</FieldLabel>
            <HtmlRichTextEditor
              content={form.costIncludes}
              onChange={(html) => set('costIncludes', html)}
              placeholder={COPY.includesPlaceholder}
            />
          </Field>
          <Field>
            <FieldLabel>{COPY.excludes}</FieldLabel>
            <HtmlRichTextEditor
              content={form.costExcludes}
              onChange={(html) => set('costExcludes', html)}
              placeholder={COPY.excludesPlaceholder}
            />
          </Field>
          <S.FullRow>
            <FieldLabel>{COPY.notes}</FieldLabel>
            <HtmlRichTextEditor
              content={form.costNotes}
              onChange={(html) => set('costNotes', html)}
              placeholder={COPY.notesPlaceholder}
            />
            <S.VisibilityToggle>
              <CheckboxRow>
                <input type="checkbox" checked={form.notesVisible} onChange={(e) => set('notesVisible', e.target.checked)} />
                {COPY.notesVisible}
              </CheckboxRow>
            </S.VisibilityToggle>
          </S.FullRow>
          <S.FullRow>
            <FieldLabel>{COPY.misc}</FieldLabel>
            <HtmlRichTextEditor
              content={form.miscText}
              onChange={(html) => set('miscText', html)}
              placeholder={COPY.miscPlaceholder}
            />
            <S.VisibilityToggle>
              <CheckboxRow>
                <input type="checkbox" checked={form.miscVisible} onChange={(e) => set('miscVisible', e.target.checked)} />
                {COPY.miscVisible}
              </CheckboxRow>
            </S.VisibilityToggle>
          </S.FullRow>
        </S.Grid>
      </S.Card>

      {saveError && <S.SaveError role="alert">{saveError}</S.SaveError>}
      {dirty && (
        <S.SaveRow>
          <S.DirtyNote>{COPY.unsaved}</S.DirtyNote>
          <ActionButton $variant="primary" onClick={save} disabled={saving} $disabled={saving}>
            {saving ? COPY.saving : COPY.save}
          </ActionButton>
        </S.SaveRow>
      )}
    </div>
  )
}
