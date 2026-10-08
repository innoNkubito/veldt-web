export interface OperatorBrandEditorProps {
  operatorId: string
  /** After a save — e.g. to refresh the list, which shows the name. */
  onSaved: () => void
}

/** The editable brand; `logoUrl` may be a fresh upload not yet saved. */
export interface BrandDraft {
  name: string
  logoUrl: string | null
}
