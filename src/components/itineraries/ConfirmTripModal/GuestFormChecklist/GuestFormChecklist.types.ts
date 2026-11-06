export interface GuestFormChecklistProps {
  itineraryId: string
  /** Checked form ids, in the order guests will see them; null until loaded. */
  selected: string[] | null
  onChange: (selected: string[]) => void
}

export interface ChecklistOption {
  id: string
  name: string
  meta: string
  archived: boolean
}
