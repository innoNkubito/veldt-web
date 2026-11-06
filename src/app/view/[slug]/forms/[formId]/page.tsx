'use client'

import GuestFormFields from '@/components/guestForms/GuestFormFields'
import * as L from '../page.styled'
import { COPY as LIST_COPY } from '../page.constants'
import { formsListPath, sharePath } from '../page.utils'
import { COPY, ID_PREFIX } from './page.constants'
import { useGuestFormPage } from './useGuestFormPage'
import * as S from './page.styled'

/** Public: a guest fills in one form and sends it to their travel advisor. */
export default function GuestFormPage() {
  const p = useGuestFormPage()

  if (p.state.phase === 'loading') {
    return (
      <L.PageRoot>
        <L.Centered>{LIST_COPY.loading}</L.Centered>
      </L.PageRoot>
    )
  }

  if (p.state.phase === 'closed' || !p.form) {
    const error = p.state.phase === 'closed' ? p.state.error : null
    return (
      <L.PageRoot>
        <L.Shell>
          {p.slug && <L.BackLink href={sharePath(p.slug)}>{LIST_COPY.back}</L.BackLink>}
          <L.Centered>
            <L.Title>{p.state.phase === 'closed' ? LIST_COPY.closedTitle : COPY.notFoundTitle}</L.Title>
            <div>{error ?? (p.state.phase === 'closed' ? LIST_COPY.closedBody : COPY.notFoundBody)}</div>
          </L.Centered>
        </L.Shell>
      </L.PageRoot>
    )
  }

  const { form } = p
  const showListLink = p.state.forms.length > 1

  return (
    <L.PageRoot>
      <L.Shell>
        <L.BackLink href={showListLink ? formsListPath(p.slug) : sharePath(p.slug)}>
          {showListLink ? COPY.backToForms : LIST_COPY.back}
        </L.BackLink>
        <L.Pretitle>{p.state.title}</L.Pretitle>

        {p.sentFor !== null ? (
          <L.Card role="status">
            <L.Title>{COPY.sentTitle}</L.Title>
            <L.Intro>{COPY.sentBody(p.sentFor)}</L.Intro>
            <S.Actions>
              {form.perGuest && <S.Button onClick={p.startAnother}>{COPY.anotherGuest}</S.Button>}
              <L.PrimaryLink href={showListLink ? formsListPath(p.slug) : sharePath(p.slug)}>
                {showListLink ? COPY.allForms : COPY.backToItinerary}
              </L.PrimaryLink>
            </S.Actions>
          </L.Card>
        ) : (
          <>
            <L.Title>{form.name}</L.Title>
            {form.description && <L.Intro>{form.description}</L.Intro>}

            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                p.submit()
              }}
            >
              <L.Card>
                <S.RequiredNote>{COPY.required}</S.RequiredNote>
                <GuestFormFields
                  idPrefix={ID_PREFIX.identity}
                  fields={p.identity}
                  values={p.values}
                  errors={p.errors}
                  onChange={p.setValue}
                  disabled={p.submitting}
                />
                <S.Divider />
                <GuestFormFields
                  idPrefix={ID_PREFIX.fields}
                  fields={form.fields}
                  values={p.values}
                  errors={p.errors}
                  onChange={p.setValue}
                  disabled={p.submitting}
                />
              </L.Card>

              {p.message && <S.Banner role="alert">{p.message}</S.Banner>}
              <S.Actions>
                <S.Button type="submit" disabled={p.submitting}>
                  {p.submitting ? COPY.submitting : COPY.submit}
                </S.Button>
              </S.Actions>
              <S.Privacy>{COPY.privacy}</S.Privacy>
            </form>
          </>
        )}
      </L.Shell>
    </L.PageRoot>
  )
}
