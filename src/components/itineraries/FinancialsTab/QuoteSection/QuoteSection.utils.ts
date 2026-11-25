import type { ItineraryCosts } from '@/stores/builderStore'
import { DEFAULT_GUESTS } from './QuoteSection.constants'
import type { QuoteForm } from './QuoteSection.types'

export function formFromCosts(costs: ItineraryCosts | null | undefined): QuoteForm {
  return {
    pricePerPerson: costs?.pricePerPerson != null ? String(costs.pricePerPerson) : '',
    numGuests: costs?.numGuests != null ? String(costs.numGuests) : String(DEFAULT_GUESTS),
    accommodationType: costs?.accommodationType ?? '',
    currency: costs?.currency ?? 'USD',
    costsToBeDetetermined: costs?.costsToBeDetetermined ?? false,
    costIncludes: costs?.costIncludes ?? '',
    costExcludes: costs?.costExcludes ?? '',
    costNotes: costs?.costNotes ?? '',
    notesVisible: costs?.notesVisible ?? false,
    miscText: costs?.miscText ?? '',
    miscVisible: costs?.miscVisible ?? false,
    priceVisible: costs?.priceVisible ?? true,
  }
}

/** What upsertCosts receives. Blank optional fields are left out rather than cleared. */
export function toCostsInput(form: QuoteForm): Partial<ItineraryCosts> {
  return {
    pricePerPerson: form.pricePerPerson ? parseFloat(form.pricePerPerson) : undefined,
    numGuests: parseInt(form.numGuests, 10) || DEFAULT_GUESTS,
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
  }
}
