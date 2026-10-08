/** Copies of the name in the diagonal stamp — enough to cover an A4/Letter page. */
export const STAMP_REPEATS = 24

export const COPY = {
  refPrefix: 'Ref',
} as const

/**
 * Page margins leave room for the fixed footer; photos are background images,
 * which browsers drop in print unless told the colours are exact.
 */
export const PRINT_PAGE_CSS = `
  @media print {
    @page {
      margin: 14mm 12mm 16mm;
    }
    * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`
