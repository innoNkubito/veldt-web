import type { ItineraryCosts } from '@/stores/builderStore'
import type { PackageInput } from '@/stores/bookingStore'

const DEFAULT_PACKAGE_NAME = 'Standard'

/** "4,500" or "4,500.50" — cents only when there are any. */
function formatAmount(amount: number): string {
  const digits = Number.isInteger(amount) ? 0 : 2
  return amount.toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: 2 })
}

/**
 * One package for the whole party at the quoted price, or null when the quote
 * has no price yet. The operator can edit it afterwards — the final price may
 * differ from the quote.
 */
export function packageFromQuote(costs: ItineraryCosts | null): PackageInput | null {
  if (!costs || costs.costsToBeDetetermined || costs.pricePerPerson == null) return null
  if (costs.pricePerPerson <= 0 || costs.numGuests < 1) return null
  const guests = costs.numGuests
  return {
    name: costs.accommodationType?.trim() || DEFAULT_PACKAGE_NAME,
    description: `${guests} ${guests === 1 ? 'guest' : 'guests'} at ${costs.currency} ${formatAmount(costs.pricePerPerson)} per person`,
    price: Math.round(costs.pricePerPerson * guests * 100) / 100,
    peopleIncluded: guests,
    totalAvailable: 1,
  }
}
