/** The quote as the form edits it — numbers as strings, for controlled inputs. */
export interface QuoteForm {
  pricePerPerson: string
  numGuests: string
  accommodationType: string
  currency: string
  costsToBeDetetermined: boolean
  costIncludes: string
  costExcludes: string
  costNotes: string
  notesVisible: boolean
  miscText: string
  miscVisible: boolean
  priceVisible: boolean
}
