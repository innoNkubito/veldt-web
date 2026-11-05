'use client'

import Link from 'next/link'
import { Container } from '../landing.styled'
import { LANDING_ROUTES } from '../constants'
import * as S from './LandingFooter.styled'

const YEAR = new Date().getFullYear()

export default function LandingFooter() {
  return (
    <S.Bar>
      <Container>
        <S.Inner>
          <span>© {YEAR} Veldt</span>
          <S.Links aria-label="Footer">
            <Link href={LANDING_ROUTES.requestAccess}>Request access</Link>
            <S.Dot aria-hidden>·</S.Dot>
            <Link href={LANDING_ROUTES.signIn}>Sign in</Link>
          </S.Links>
        </S.Inner>
      </Container>
    </S.Bar>
  )
}
