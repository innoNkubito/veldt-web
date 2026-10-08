/** The operator's watermark, as every itinerary query returns it. */
export interface OperatorBrandMark {
  name: string
  logoUrl: string | null
}

/**
 * cover     — "Prepared by" bar at the top of the cover photo
 * inline    — "Prepared by" line (footer, travel dashboard)
 * photo     — small corner mark over a proposal photo
 */
export type OperatorMarkVariant = 'cover' | 'inline' | 'photo'

export interface OperatorMarkProps {
  brand: OperatorBrandMark
  variant: OperatorMarkVariant
}
