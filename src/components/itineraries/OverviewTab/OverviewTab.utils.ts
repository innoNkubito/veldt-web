import type { ItineraryFull, UpdateItineraryInput } from '@/stores/builderStore'
import type { OverviewForm } from './OverviewTab.types'

export function formFromItinerary(itinerary: ItineraryFull | null): OverviewForm {
  return {
    proposalTitle: itinerary?.proposalTitle ?? '',
    preparedFor: itinerary?.preparedFor ?? '',
    travelDates: itinerary?.travelDates ?? '',
    internalNotes: itinerary?.internalNotes ?? '',
    whiteLabel: itinerary?.whiteLabel ?? false,
  }
}

/** Blank optional fields are sent as undefined (left unchanged). */
export function toUpdateInput(form: OverviewForm): UpdateItineraryInput {
  return {
    proposalTitle: form.proposalTitle,
    preparedFor: form.preparedFor || undefined,
    travelDates: form.travelDates || undefined,
    internalNotes: form.internalNotes || undefined,
    whiteLabel: form.whiteLabel,
  }
}

export function shareUrl(origin: string, slug: string): string {
  return `${origin}/view/${slug}`
}

export function viewCountLabel(count: number): string {
  return `${count} view${count !== 1 ? 's' : ''}`
}
