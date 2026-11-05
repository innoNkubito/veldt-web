'use client'

import { HERO_PHONE_ID } from '../constants'
import { DEPOSIT_DUE } from './constants'
import type { ProposalPhoneProps } from './types'
import * as S from './ProposalPhone.styled'

// A static mock of a client-facing proposal. Purely illustrative, so the
// whole frame is exposed to assistive tech as one labelled figure.
export default function ProposalPhone({ proposal }: ProposalPhoneProps) {
  return (
    <S.Frame id={HERO_PHONE_ID} aria-label={`Example proposal: ${proposal.title}`}>
      <S.Notch aria-hidden />
      <S.Search aria-hidden>
        <span>{proposal.query}</span>
        <S.BuildChip>Build</S.BuildChip>
      </S.Search>

      <S.Cover>
        <S.CoverArt viewBox="0 0 120 64" aria-hidden>
          <circle cx="48" cy="30" r="16" fill="currentColor" />
          <path
            d="M70 26c10-6 30-6 40 0-8 2-14 2-18 2v36h-4V28c-4 0-10 0-18-2z"
            fill="currentColor"
          />
        </S.CoverArt>
        <S.CoverMeta>
          For the {proposal.client} · {proposal.nights} nights
        </S.CoverMeta>
        <S.CoverTitle>{proposal.title}</S.CoverTitle>
      </S.Cover>

      <S.Timeline>
        {proposal.stops.map((stop) => (
          <S.Stop key={stop.name}>
            <S.StopName>{stop.name}</S.StopName>
            <S.StopWhen>{stop.when}</S.StopWhen>
          </S.Stop>
        ))}
      </S.Timeline>

      <S.Deposit>
        <div>
          <S.DepositLabel>Deposit requested</S.DepositLabel>
          <S.DepositMeta>
            {proposal.deposit} · {DEPOSIT_DUE}
          </S.DepositMeta>
        </div>
        <S.PayChip aria-hidden>Accept &amp; pay</S.PayChip>
      </S.Deposit>
    </S.Frame>
  )
}
