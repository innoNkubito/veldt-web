import type { SampleProposal } from './types'

// Illustrative content for the landing-page phone. Not customer data.
export const SAMPLE_PROPOSALS: SampleProposal[] = [
  {
    id: 'mara',
    label: 'Masai Mara',
    query: 'Masai Mara, Kenya',
    client: 'Okoro family',
    nights: 8,
    title: 'Mara to Laikipia',
    stops: [
      { name: 'Naboisho Camp · private conservancy', when: 'Nights 1–3' },
      { name: 'Hot-air balloon over the Mara', when: 'Day 2' },
      { name: 'Ol Pejeta Bush Camp', when: 'Nights 4–6' },
      { name: 'Giraffe Manor, Nairobi', when: 'Nights 7–8' },
    ],
    deposit: '$6,400',
  },
]

export const DEPOSIT_DUE = 'due in 7 days'
