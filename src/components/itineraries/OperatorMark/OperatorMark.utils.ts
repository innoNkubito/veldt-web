import type { OperatorMarkVariant } from './OperatorMark.types'

/** Logo height per variant, in px. */
export function logoHeight(variant: OperatorMarkVariant): number {
  return variant === 'cover' ? 28 : variant === 'photo' ? 16 : 22
}
