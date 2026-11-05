'use client'

import { Container, GhostPill, PrimaryPill } from '../landing.styled'
import { LANDING_ROUTES } from '../constants'
import * as S from './LandingHeader.styled'

export default function LandingHeader() {
  return (
    <S.Bar>
      <Container>
        <S.Inner>
          <S.Wordmark>
            <S.WordmarkTitle>Veldt</S.WordmarkTitle>
            <S.WordmarkSubtitle>Travel operations</S.WordmarkSubtitle>
          </S.Wordmark>
          <S.Actions aria-label="Account">
            <GhostPill href={LANDING_ROUTES.signIn}>Sign in</GhostPill>
            <PrimaryPill href={LANDING_ROUTES.requestAccess}>Request access</PrimaryPill>
          </S.Actions>
        </S.Inner>
      </Container>
    </S.Bar>
  )
}
