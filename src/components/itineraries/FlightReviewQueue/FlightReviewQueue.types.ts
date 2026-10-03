import type { FlightSegment } from '@/stores/builderStore'

export interface FlightReviewQueueProps {
  /** Traveller submissions not yet approved. */
  flights: FlightSegment[]
}
