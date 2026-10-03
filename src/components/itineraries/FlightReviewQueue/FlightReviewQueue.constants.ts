export const COPY = {
  title: 'Sent by the traveller',
  intro:
    'Check these against the booking before approving. Approved flights appear on the traveller’s share link; dismissed ones are deleted.',
  approve: 'Approve',
  dismiss: 'Dismiss',
  timeTbc: 'Time to be confirmed',
  dismissTitle: (flightNumber: string) => `Dismiss ${flightNumber}?`,
  dismissMessage: 'The traveller’s submission is deleted. You can still add the flight yourself.',
} as const
