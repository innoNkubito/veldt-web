'use client'

import Link from 'next/link'
import { Container, GhostPill } from '../landing.styled'
import { HERO_PHONE_ID, LANDING_ROUTES } from '../constants'
import ProposalPhone, { SAMPLE_PROPOSALS } from '../ProposalPhone'
import { HERO_COPY } from './constants'
import * as S from './LandingHero.styled'

export default function LandingHero() {
  return (
    <S.Panel>
      <Container>
        <S.Grid>
          <S.Copy>
            <S.Title $step={0}>
              Proposals worth <em>arriving</em> for.
            </S.Title>
            <S.Lead $step={1}>{HERO_COPY.lead}</S.Lead>
            <S.Actions $step={2}>
              <S.LightPill href={LANDING_ROUTES.requestAccess}>Request access</S.LightPill>
              <GhostPill href={`#${HERO_PHONE_ID}`} $onDark>
                {HERO_COPY.demo}
              </GhostPill>
            </S.Actions>
            <S.InviteNote $step={3}>
              {HERO_COPY.invitePrompt}{' '}
              <Link href={LANDING_ROUTES.signUp}>{HERO_COPY.inviteLink}</Link>
            </S.InviteNote>
          </S.Copy>

          <S.PhoneSlot $step={2}>
            <ProposalPhone proposal={SAMPLE_PROPOSALS[0]} />
          </S.PhoneSlot>
        </S.Grid>
      </Container>
    </S.Panel>
  )
}
