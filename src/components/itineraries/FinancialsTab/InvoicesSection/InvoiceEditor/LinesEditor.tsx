'use client'

import { FieldInput } from '@/components/itineraries/shared/FieldPrimitives'
import { formatMoney } from '@/lib/invoices'
import { MAX_LINES } from '../InvoicesSection.constants'
import type { InvoiceEditorModel } from './useInvoiceEditor'
import * as S from './InvoiceEditor.styled'

/** Description, quantity, unit price and tax per line; reorder and remove. */
export default function LinesEditor({ e, currency }: { e: InvoiceEditorModel; currency: string }) {
  const { form, totals, lines } = e
  return (
    <>
      <S.Rows>
        {form.lines.map((line, i) => (
          <S.LineRow key={line.key}>
            <S.Wide>
              <S.SmallLabel htmlFor={`line-desc-${line.key}`}>Description</S.SmallLabel>
              <FieldInput
                id={`line-desc-${line.key}`}
                value={line.description}
                maxLength={300}
                placeholder="e.g. Lodge, 3 nights"
                onChange={(ev) => lines.set(line.key, { description: ev.target.value })}
              />
            </S.Wide>
            <S.RowTools>
              <S.IconButton
                type="button"
                aria-label="Move line up"
                disabled={i === 0}
                onClick={() => lines.move(i, -1)}
              >
                ↑
              </S.IconButton>
              <S.IconButton
                type="button"
                aria-label="Move line down"
                disabled={i === form.lines.length - 1}
                onClick={() => lines.move(i, 1)}
              >
                ↓
              </S.IconButton>
              <S.IconButton type="button" aria-label="Remove line" onClick={() => lines.remove(line.key)}>
                ✕
              </S.IconButton>
            </S.RowTools>
            <div>
              <S.SmallLabel htmlFor={`line-qty-${line.key}`}>Qty</S.SmallLabel>
              <FieldInput
                id={`line-qty-${line.key}`}
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={line.quantity}
                onChange={(ev) => lines.set(line.key, { quantity: ev.target.value })}
              />
            </div>
            <div>
              <S.SmallLabel htmlFor={`line-price-${line.key}`}>Unit price</S.SmallLabel>
              <FieldInput
                id={`line-price-${line.key}`}
                type="number"
                step="0.01"
                inputMode="decimal"
                value={line.unitPrice}
                onChange={(ev) => lines.set(line.key, { unitPrice: ev.target.value })}
              />
            </div>
            <div>
              <S.SmallLabel htmlFor={`line-tax-${line.key}`}>Tax %</S.SmallLabel>
              <FieldInput
                id={`line-tax-${line.key}`}
                type="number"
                min="0"
                max="100"
                step="0.01"
                inputMode="decimal"
                value={line.taxRate}
                onChange={(ev) => lines.set(line.key, { taxRate: ev.target.value })}
              />
            </div>
            <S.LineAmount>{formatMoney(totals.lines[i]?.lineTotal ?? 0, currency)}</S.LineAmount>
          </S.LineRow>
        ))}
      </S.Rows>
      <S.Tools>
        <S.TextButton type="button" onClick={lines.add} disabled={form.lines.length >= MAX_LINES}>
          + Add line
        </S.TextButton>
      </S.Tools>
    </>
  )
}
