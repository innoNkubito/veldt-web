'use client'

import { COPY } from './page.constants'
import { formPath, sharePath } from './page.utils'
import { useTripForms } from './useTripForms'
import * as S from './page.styled'

/** Public: the forms this trip asks its guests to fill in. */
export default function TripFormsPage() {
  const { slug, state } = useTripForms()

  if (state.phase === 'loading') {
    return (
      <S.PageRoot>
        <S.Centered>{COPY.loading}</S.Centered>
      </S.PageRoot>
    )
  }

  return (
    <S.PageRoot>
      <S.Shell>
        {slug && <S.BackLink href={sharePath(slug)}>{COPY.back}</S.BackLink>}
        {state.phase === 'closed' ? (
          <S.Centered>
            <S.Title>{COPY.closedTitle}</S.Title>
            <div>{state.error ?? COPY.closedBody}</div>
          </S.Centered>
        ) : (
          <>
            <S.Pretitle>{state.title}</S.Pretitle>
            <S.Title>{COPY.title}</S.Title>
            <S.Intro>{COPY.intro}</S.Intro>
            <S.FormList>
              {state.forms.map((form) => (
                <S.FormItem key={form.id}>
                  <div>
                    <S.FormName>{form.name}</S.FormName>
                    <S.FormMeta>
                      {COPY.questions(form.questionCount)} · {form.perGuest ? COPY.perGuestNote : COPY.perTripNote}
                    </S.FormMeta>
                  </div>
                  <S.PrimaryLink href={formPath(slug, form.id)}>{COPY.fillIn}</S.PrimaryLink>
                </S.FormItem>
              ))}
            </S.FormList>
          </>
        )}
      </S.Shell>
    </S.PageRoot>
  )
}
