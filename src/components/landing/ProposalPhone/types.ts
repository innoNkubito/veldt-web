export interface ProposalStop {
  name: string
  when: string
}

// One sample proposal shown in the hero phone.
export interface SampleProposal {
  id: string
  label: string // chip label, e.g. "Masai Mara"
  query: string // what's "typed" into the phone's search bar
  client: string
  nights: number
  title: string
  stops: ProposalStop[]
  deposit: string
}

export interface ProposalPhoneProps {
  proposal: SampleProposal
}
