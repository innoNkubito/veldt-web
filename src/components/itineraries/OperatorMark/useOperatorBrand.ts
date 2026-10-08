import { createContext, useContext } from 'react'
import type { OperatorBrandMark } from './OperatorMark.types'

/**
 * The brand of the itinerary being shown, so deep proposal blocks (photos) can
 * stamp it without threading a prop through every section. Null outside a
 * proposal (e.g. the content library), where nothing is stamped.
 */
const OperatorBrandContext = createContext<OperatorBrandMark | null>(null)

export const OperatorBrandProvider = OperatorBrandContext.Provider

export function useOperatorBrand(): OperatorBrandMark | null {
  return useContext(OperatorBrandContext)
}
