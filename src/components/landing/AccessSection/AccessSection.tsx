'use client'

import Link from 'next/link'
import { Container, Eyebrow, PrimaryPill, Section, SectionTitle } from '../landing.styled'
import { LANDING_ROUTES } from '../constants'
import SpotsCard from '../SpotsCard'
import { ACCESS_COPY, ACCESS_STEPS } from './constants'
import * as S from './AccessSection.styled'

export default function AccessSection() {
  return (
    <Section aria-labelledby="access-title">
      <Container>
        <S.Grid>
          <div>
            <Eyebrow>{ACCESS_COPY.eyebrow}</Eyebrow>
            <SectionTitle id="access-title">{ACCESS_COPY.title}</SectionTitle>
            <S.Lead>{ACCESS_COPY.lead}</S.Lead>

            <S.Steps>
              {ACCESS_STEPS.map((step) => (
                <S.Step key={step.title}>
                  <S.StepTitle>{step.title}</S.StepTitle>
                  <S.StepBody>{step.body}</S.StepBody>
                </S.Step>
              ))}
            </S.Steps>

            <S.Cta>
              <PrimaryPill href={LANDING_ROUTES.requestAccess}>Request access</PrimaryPill>
              <S.InviteNote>
                {ACCESS_COPY.invitePrompt}{' '}
                <Link href={LANDING_ROUTES.signUp}>{ACCESS_COPY.inviteLink}</Link>
              </S.InviteNote>
            </S.Cta>
          </div>

          <SpotsCard />
        </S.Grid>
      </Container>
    </Section>
  )
}
