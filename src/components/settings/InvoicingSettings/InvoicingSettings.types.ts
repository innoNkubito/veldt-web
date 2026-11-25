/** The form's values — every field a string for controlled inputs. */
export interface InvoicingForm {
  legalName: string
  address: string
  taxId: string
  bankDetails: string
  numberPrefix: string
  defaultNotes: string
  defaultTerms: string
}
