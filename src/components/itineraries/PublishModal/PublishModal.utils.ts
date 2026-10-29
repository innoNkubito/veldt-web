import type { PublishIssue } from '@/stores/builderStore'
import { BUILDER_SECTION } from '@/lib/builderSections'
import type { FixTarget } from './PublishModal.types'

const TARGETS: Record<PublishIssue['code'], FixTarget> = {
  NO_DAYS: { tab: 'rows', section: BUILDER_SECTION.days },
  COSTS_UNCONFIRMED: { tab: 'costs', section: BUILDER_SECTION.costsAccuracy },
  BOOKING_NO_PROCESSOR: { tab: 'booking', section: BUILDER_SECTION.bookingProcessor },
  BOOKING_NO_PACKAGE: { tab: 'booking', section: BUILDER_SECTION.bookingPackages },
  BOOKING_NO_SCHEDULE: { tab: 'booking', section: BUILDER_SECTION.bookingSchedule },
  BOOKING_NO_EXTERNAL_LINK: { tab: 'booking', section: BUILDER_SECTION.bookingMode },
}

export function fixTarget(issue: PublishIssue): FixTarget {
  return TARGETS[issue.code]
}
