import type { FlightSegment } from '@/stores/builderStore'

export interface FlightItemProps {
  flight: FlightSegment
  /** Live status is tracked on confirmed and travelling trips only. */
  showLiveStatus: boolean
  onEdit: () => void
  onDelete: () => void
}
