'use client'

import {
  Container,
  GhostPill,
  PrimaryPill,
  Wordmark,
  WordmarkSubtitle,
  WordmarkTitle,
} from '../landing.styled'
import { LANDING_ROUTES } from '../constants'
import { useLandingHeader } from './useLandingHeader'
import * as S from './LandingHeader.styled'

export default function LandingHeader() {
  const { scrolled } = useLandingHeader()

  return (
    <S.Bar $scrolled={scrolled}>
      <Container>
        <S.Inner>
          <Wordmark>
            <WordmarkTitle>Veldt</WordmarkTitle>
            <WordmarkSubtitle>Travel Operations</WordmarkSubtitle>
          </Wordmark>
          <S.Actions aria-label="Account">
            <GhostPill href={LANDING_ROUTES.signIn}>Sign in</GhostPill>
            <PrimaryPill href={LANDING_ROUTES.requestAccess}>Request access</PrimaryPill>
          </S.Actions>
        </S.Inner>
      </Container>
    </S.Bar>
  )
}
