import type { DraftField, MoveDirection } from '../GuestFormBuilder.types'

export interface FieldEditorProps {
  field: DraftField
  index: number
  total: number
  issue: string | undefined
  readOnly: boolean
  onChange: (patch: Partial<DraftField>) => void
  onMove: (direction: MoveDirection) => void
  onDuplicate: () => void
  onRemove: () => void
}
