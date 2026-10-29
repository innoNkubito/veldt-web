'use client'

import { focusSection } from '@/lib/focusSection'
import * as S from './BookingSetupChecklist.styled'
import { COPY } from './BookingSetupChecklist.constants'
import type { BookingSetupChecklistProps } from './BookingSetupChecklist.types'

/**
 * Book through Veldt needs a processor, a package and a payment schedule
 * together. This tracks the three and jumps to whichever is missing.
 */
export default function BookingSetupChecklist({ steps }: BookingSetupChecklistProps) {
  const done = steps.filter((step) => step.done).length
  const complete = done === steps.length

  return (
    <S.Root $complete={complete}>
      <S.Header>
        <S.Title>{COPY.title}</S.Title>
        <S.Progress>{COPY.progress(done, steps.length)}</S.Progress>
      </S.Header>
      <S.Note>{complete ? COPY.complete : COPY.incomplete}</S.Note>
      <S.Steps>
        {steps.map((step, index) => (
          <S.Step key={step.key}>
            <S.Marker $done={step.done}>{step.done ? '✓' : index + 1}</S.Marker>
            <S.StepText>
              <S.StepTitle>{step.title}</S.StepTitle>
              <S.StepDetail>{step.detail}</S.StepDetail>
            </S.StepText>
            {!step.done && (
              <S.GoButton type="button" onClick={() => focusSection(step.section)}>
                {COPY.go}
              </S.GoButton>
            )}
          </S.Step>
        ))}
      </S.Steps>
    </S.Root>
  )
}
