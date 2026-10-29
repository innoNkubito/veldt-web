export const COPY = {
  title: 'Book through Veldt setup',
  progress: (done: number, total: number) => `${done} of ${total} done`,
  incomplete:
    'All three are needed before you can publish — otherwise the client’s Book button leads nowhere.',
  complete: 'Ready. Clients can book once you confirm the trip.',
  go: 'Go →',
  processor: {
    title: 'Payment processor',
    todo: 'Choose one under Invoice Settings, then Save Booking Settings.',
    unsaved: 'Chosen — click Save Booking Settings to finish this step.',
    done: 'Saved.',
  },
  packages: {
    title: 'At least one package',
    todo: 'What the client books — add one, or create it from the quote.',
    done: (n: number) => `${n} ${n === 1 ? 'package' : 'packages'}.`,
  },
  schedule: {
    title: 'Payment schedule',
    todo: 'At least the payment due at booking. Add it, then Save Schedule.',
    done: (n: number) => `${n} ${n === 1 ? 'payment' : 'payments'}.`,
  },
} as const
