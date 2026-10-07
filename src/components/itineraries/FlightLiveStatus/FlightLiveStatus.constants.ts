/** Delays shown from here; emails start at 30 min (API `DELAY_THRESHOLD_MINUTES`). */
export const DELAY_DISPLAY_MINUTES = 15

export const COPY = {
  untrackable: "Can't be tracked",
  untrackableDetail: 'Live status needs a flight number like KQ 101 and a departure date.',
  notYet: 'Not tracked yet',
  notYetDetail: 'Live status starts 24 hours before departure.',
  unknown: 'No live data',
  onTime: 'On time',
  delayed: 'Delayed',
  departed: 'Departed',
  landed: 'Landed',
  cancelled: 'Cancelled',
  diverted: 'Diverted',
  nowDeparts: 'Now departs',
  expectedArrival: 'Expected to arrive',
  arrived: 'Arrived',
  checked: 'Checked',
  advisorInformed: 'Your travel advisor has been told.',
} as const
