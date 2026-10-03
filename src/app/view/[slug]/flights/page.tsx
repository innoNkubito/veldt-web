'use client'

import * as S from './page.styled'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { Field, FieldInput, FieldLabel } from '@/components/itineraries/shared/FieldPrimitives'
import FlightModal from '@/components/itineraries/FlightModal'
import { useFlightsPage } from './useFlightsPage'
import { COPY } from './page.constants'
import { backPath, flightSummary } from './page.utils'

/** Public: the traveller sends their own flight details for the operator to review. */
export default function FlightsPage() {
  const page = useFlightsPage()

  if (page.phase === 'loading') {
    return <S.PageRoot><S.Centered>{COPY.loading}</S.Centered></S.PageRoot>
  }

  if (page.phase === 'closed') {
    return (
      <S.PageRoot>
        <S.Shell>
          <S.Centered>
            <S.Title>{COPY.closedTitle}</S.Title>
            <div>{page.error ?? COPY.closedBody}</div>
          </S.Centered>
        </S.Shell>
      </S.PageRoot>
    )
  }

  return (
    <S.PageRoot>
      <S.Shell>
        {page.slug && <S.BackLink href={backPath(page.slug)}>{COPY.back}</S.BackLink>}
        <S.Pretitle>{page.title}</S.Pretitle>

        {page.phase === 'sent' ? (
          <>
            <S.Title>{COPY.sentTitle}</S.Title>
            <S.Intro>{COPY.sentBody(page.sentCount)}</S.Intro>
          </>
        ) : (
          <>
            <S.Title>{COPY.title}</S.Title>
            <S.Intro>{COPY.intro}</S.Intro>

            <S.Card>
              <Field>
                <FieldLabel htmlFor="traveller-email">{COPY.emailLabel}</FieldLabel>
                <FieldInput
                  id="traveller-email"
                  type="email"
                  autoComplete="email"
                  value={page.email}
                  onChange={(e) => page.setEmail(e.target.value)}
                />
                <S.Hint>{COPY.emailHint}</S.Hint>
              </Field>
            </S.Card>

            <S.Card>
              {page.flights.length === 0 && <S.Empty>{COPY.empty}</S.Empty>}
              {page.flights.map((flight, index) => (
                <S.FlightRow key={index}>
                  <span>{flightSummary(flight, COPY.timeTbc)}</span>
                  <S.RowActions>
                    <ActionButton $variant="ghost" onClick={() => page.startEdit(index)}>{COPY.edit}</ActionButton>
                    <ActionButton $variant="ghost" onClick={() => page.removeFlight(index)}>{COPY.remove}</ActionButton>
                  </S.RowActions>
                </S.FlightRow>
              ))}
              <S.AddRow>
                <ActionButton onClick={page.startAdd}>
                  {page.flights.length === 0 ? COPY.addFlight : COPY.addAnother}
                </ActionButton>
              </S.AddRow>
            </S.Card>

            {page.error && <S.ErrorText>{page.error}</S.ErrorText>}
            <S.Footer>
              <ActionButton $variant="primary" onClick={page.submit} $disabled={page.submitting} disabled={page.submitting}>
                {page.submitting ? COPY.submitting : COPY.submit}
              </ActionButton>
            </S.Footer>
          </>
        )}
      </S.Shell>

      {page.editing && (
        <FlightModal
          flight={page.editingFlight}
          airportZones={page.airportZones}
          onSubmit={page.saveFlight}
          onCancel={page.cancelEdit}
        />
      )}
    </S.PageRoot>
  )
}
