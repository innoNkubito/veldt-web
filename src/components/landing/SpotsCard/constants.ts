import type { Market } from './types'

// PLACEHOLDER — hand-edited each month. Values from the design artifact.
export const SPOTS = {
  month: 'November',
  total: 10,
  left: 7,
}

export const MARKETS: Market[] = [
  { country: 'Kenya' },
  { country: 'Tanzania' },
  { country: 'Rwanda' },
  { country: 'Botswana' },
  { country: 'South Africa' },
  { country: 'Namibia', opensIn: 'Nov' },
  { country: 'Zambia', opensIn: 'Dec' },
  { country: 'Uganda', opensIn: 'Jan' },
]
