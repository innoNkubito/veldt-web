import type { ProofQuote, ProofStat } from './types'

// PLACEHOLDER — prototype figures from the design artifact. Replace with the
// beta cohort's real numbers, and quotes/names we have permission to use,
// before this goes to production.

export const PROOF_TITLE = 'Early operators, real numbers.'

export const PROOF_STATS: ProofStat[] = [
  { value: 1240, label: 'proposals sent through Veldt since beta opened' },
  { value: 38, suffix: '%', label: 'faster from enquiry to accepted proposal' },
  { value: 412, prefix: '$', suffix: 'k', label: 'in deposits collected inside proposals' },
]

export const PROOF_QUOTES: ProofQuote[] = [
  {
    quote:
      'We used to lose a day to every revision. Now the client changes the camp and the price updates in front of them.',
    name: 'Amara Osei',
    company: 'Golden Horizon Safaris, Nairobi',
  },
  {
    quote: 'The first time a client paid a deposit at 11pm without emailing me, I knew.',
    name: 'Sophie Vandermeer',
    company: 'Maison du Voyage',
  },
  {
    quote: 'Our proposals finally look like the trips.',
    name: 'James Ngatia',
    company: 'East Africa DMC, Arusha',
  },
]

export const PROOF_OPERATORS = [
  'Golden Horizon',
  'Maison du Voyage',
  'East Africa DMC',
  'Zafaris Co.',
  'Livand',
]

export const COUNT_UP_MS = 1400
export const IN_VIEW_THRESHOLD = 0.35
