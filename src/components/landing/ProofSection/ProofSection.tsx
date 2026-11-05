'use client'

import { Container, Section, VisuallyHidden } from '../landing.styled'
import {
  PROOF_OPERATORS,
  PROOF_QUOTES,
  PROOF_STATS,
  PROOF_TITLE,
} from './constants'
import { useProofSection } from './useProofSection'
import { formatStat } from './utils'
import * as S from './ProofSection.styled'

export default function ProofSection() {
  const { ref, progress } = useProofSection()

  return (
    <Section ref={ref} aria-labelledby="proof-title">
      <Container>
        <S.Panel>
          <S.Title id="proof-title">{PROOF_TITLE}</S.Title>

          <S.Columns>
            {PROOF_STATS.map((stat) => (
              <S.Stat key={stat.label}>
                {/* Screen readers get the final figure, not the animation. */}
                <S.StatValue aria-hidden>{formatStat(stat, progress)}</S.StatValue>
                <S.StatLabel>
                  <VisuallyHidden>{formatStat(stat, 1)} </VisuallyHidden>
                  {stat.label}
                </S.StatLabel>
              </S.Stat>
            ))}

            {PROOF_QUOTES.map((q) => (
              <S.Quote key={q.name}>
                <S.QuoteText>“{q.quote}”</S.QuoteText>
                <S.QuoteBy>
                  {q.name} · {q.company}
                </S.QuoteBy>
              </S.Quote>
            ))}
          </S.Columns>

          <S.Operators aria-label="Operators using Veldt">
            {PROOF_OPERATORS.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </S.Operators>
        </S.Panel>
      </Container>
    </Section>
  )
}
