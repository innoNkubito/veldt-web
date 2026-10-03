/** One link in the Preview's table of contents. */
export interface TocEntry {
  /** DOM id of the section it scrolls to. */
  targetId: string
  label: string
  /** Shown as a numbered badge for day entries. */
  dayNumber?: number
}

/** A group of ToC links; groups without a label render their links bare. */
export interface TocGroup {
  key: string
  label?: string
  entries: TocEntry[]
}
