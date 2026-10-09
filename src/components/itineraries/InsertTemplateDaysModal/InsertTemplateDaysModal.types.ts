import type { ItineraryRow } from '@/stores/builderStore'

export interface InsertTemplateDaysModalProps {
  itineraryId: string
  /** The itinerary's days in order — the insertion points. */
  rows: ItineraryRow[]
  onClose: () => void
}
