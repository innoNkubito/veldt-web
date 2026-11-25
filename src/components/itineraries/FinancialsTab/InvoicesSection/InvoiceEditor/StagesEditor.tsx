'use client'

import { FieldInput } from '@/components/itineraries/shared/FieldPrimitives'
import { formatMoney } from '@/lib/invoices'
import { MAX_STAGES } from '../InvoicesSection.constants'
import type { InvoiceEditorModel } from './useInvoiceEditor'
import * as S from './InvoiceEditor.styled'

/** When the client pays: label, due date and amount per payment. */
export default function StagesEditor({ e, currency }: { e: InvoiceEditorModel; currency: string }) {
  const { form, totals, stages } = e
  const ok = Math.round(totals.stagesSum * 100) === Math.round(totals.total * 100)
  return (
    <>
      <S.Rows>
        {form.stages.map((stage) => (
          <S.StageRow key={stage.key}>
            <div>
              <S.SmallLabel htmlFor={`stage-label-${stage.key}`}>
                Label {stage.installmentId && <S.Linked>· pays online via the booking</S.Linked>}
              </S.SmallLabel>
              <FieldInput
                id={`stage-label-${stage.key}`}
                value={stage.label}
                maxLength={80}
                placeholder="Deposit"
                onChange={(ev) => stages.set(stage.key, { label: ev.target.value })}
              />
            </div>
            <div>
              <S.SmallLabel htmlFor={`stage-date-${stage.key}`}>Due</S.SmallLabel>
              <FieldInput
                id={`stage-date-${stage.key}`}
                type="date"
                value={stage.dueDate}
                onChange={(ev) => stages.set(stage.key, { dueDate: ev.target.value })}
              />
            </div>
            <div>
              <S.SmallLabel htmlFor={`stage-amount-${stage.key}`}>Amount</S.SmallLabel>
              <FieldInput
                id={`stage-amount-${stage.key}`}
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={stage.amount}
                onChange={(ev) => stages.set(stage.key, { amount: ev.target.value })}
              />
            </div>
            <S.IconButton type="button" aria-label="Remove payment" onClick={() => stages.remove(stage.key)}>
              ✕
            </S.IconButton>
          </S.StageRow>
        ))}
      </S.Rows>
      <S.Tools>
        <S.TextButton type="button" onClick={stages.add} disabled={form.stages.length >= MAX_STAGES}>
          + Add payment
        </S.TextButton>
        <S.TextButton type="button" onClick={stages.splitEvenly} disabled={totals.total <= 0}>
          Split evenly
        </S.TextButton>
        <S.TextButton type="button" onClick={stages.matchTotal} disabled={totals.total <= 0}>
          Last payment takes the rest
        </S.TextButton>
        {stages.hasSchedule && !e.linked && (
          <S.TextButton type="button" onClick={stages.useSchedule} disabled={totals.total <= 0}>
            Use trip schedule
          </S.TextButton>
        )}
      </S.Tools>
      {form.stages.length > 0 && (
        <S.Sum $ok={ok} role="status">
          {ok
            ? `Adds up to the total, ${formatMoney(totals.total, currency)}.`
            : `Payments add up to ${formatMoney(totals.stagesSum, currency)} — the total is ${formatMoney(totals.total, currency)}.`}
        </S.Sum>
      )}
    </>
  )
}
