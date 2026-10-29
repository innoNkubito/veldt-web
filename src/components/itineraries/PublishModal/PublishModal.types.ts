import type { PublishIssue } from '@/stores/builderStore'
import type { BuilderSectionId } from '@/lib/builderSections'

/** Where an issue is fixed: the builder tab and the section on it. */
export interface FixTarget {
  tab: 'rows' | 'costs' | 'booking'
  section: BuilderSectionId
}

export interface PublishModalProps {
  itineraryId: string
  onConfirm: () => void
  onCancel: () => void
  /** Closes the modal and takes the advisor to the section that needs work. */
  onFix: (target: FixTarget) => void
  loading: boolean
}

export type IssuesState =
  | { status: 'checking' }
  | { status: 'ready'; issues: PublishIssue[] }
  /** The check failed — publishing is still allowed; the API checks again. */
  | { status: 'unknown'; error: string }
