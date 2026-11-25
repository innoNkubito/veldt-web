import type { BuilderSectionId } from '@/lib/builderSections'

/** What has been saved so far — the API checks the same three things before publishing. */
export interface SetupFacts {
  /** A processor is saved on the config and not disabled. */
  processorReady: boolean
  /** A processor is chosen in the form but the settings aren't saved yet. */
  processorUnsaved: boolean
  packageCount: number
  scheduleCount: number
}

export interface SetupStep {
  key: 'processor' | 'packages' | 'schedule'
  title: string
  detail: string
  done: boolean
  section: BuilderSectionId
}

export interface BookingSetupChecklistProps {
  steps: SetupStep[]
}
