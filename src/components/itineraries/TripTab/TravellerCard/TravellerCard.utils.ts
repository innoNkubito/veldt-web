import type { ItineraryFull, TripDetailsInput } from '@/stores/builderStore'
import type { TravellerForm } from './TravellerCard.types'

export function formFromItinerary(itinerary: ItineraryFull | null): TravellerForm {
  return {
    clientEmail: itinerary?.clientEmail ?? '',
    clientPhone: itinerary?.clientPhone ?? '',
    startDate: itinerary?.startDate ?? '',
    endDate: itinerary?.endDate ?? '',
  }
}

/** Blank dates are sent as null (cleared); the API refuses that once confirmed. */
export function toTripDetails(form: TravellerForm): TripDetailsInput {
  return {
    clientEmail: form.clientEmail,
    clientPhone: form.clientPhone,
    startDate: form.startDate || null,
    endDate: form.endDate || null,
  }
}
