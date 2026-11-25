import { BUILDER_SECTION, type BuilderSectionId } from '@/lib/builderSections'
import { COPY } from './BookingSetupChecklist.constants'
import type { SetupFacts, SetupStep } from './BookingSetupChecklist.types'

/** The three steps, in the order they're done: processor → package → schedule. */
export function setupSteps(facts: SetupFacts): SetupStep[] {
  return [
    {
      key: 'processor',
      title: COPY.processor.title,
      detail: facts.processorReady
        ? COPY.processor.done
        : facts.processorUnsaved
          ? COPY.processor.unsaved
          : COPY.processor.todo,
      done: facts.processorReady,
      section: BUILDER_SECTION.bookingProcessor,
    },
    {
      key: 'packages',
      title: COPY.packages.title,
      detail: facts.packageCount > 0 ? COPY.packages.done(facts.packageCount) : COPY.packages.todo,
      done: facts.packageCount > 0,
      section: BUILDER_SECTION.bookingPackages,
    },
    {
      key: 'schedule',
      title: COPY.schedule.title,
      detail:
        facts.scheduleCount > 0 ? COPY.schedule.done(facts.scheduleCount) : COPY.schedule.todo,
      done: facts.scheduleCount > 0,
      section: BUILDER_SECTION.bookingSchedule,
    },
  ]
}

/** Where to send the advisor next, or null when setup is complete. */
export function nextSetupSection(steps: SetupStep[]): BuilderSectionId | null {
  return steps.find((step) => !step.done)?.section ?? null
}
