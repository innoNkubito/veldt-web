import type { OperatorBrandMark } from '@/components/itineraries/OperatorMark'

export interface PrintWatermarkProps {
  brand: OperatorBrandMark
  /** e.g. VLD-4F2A9C */
  reference: string
  /** The share link, shown without the protocol. */
  shareUrl: string
}
