'use client'

import {
  CheckboxRow,
  FieldInput,
  FieldLabel,
  FieldSelect,
  FieldTextarea,
} from '@/components/itineraries/shared/FieldPrimitives'
import { FIELD_TYPE_CONFIG, FIELD_TYPE_ORDER, type GuestFormFieldType } from '@/lib/guestForms'
import { COPY } from './FieldEditor.constants'
import type { FieldEditorProps } from './FieldEditor.types'
import * as S from './FieldEditor.styled'

/** One question (or section heading) in the builder. */
export default function FieldEditor({
  field,
  index,
  total,
  issue,
  readOnly,
  onChange,
  onMove,
  onDuplicate,
  onRemove,
}: FieldEditorProps) {
  const config = FIELD_TYPE_CONFIG[field.type]
  const id = (part: string) => `field-${field.key}-${part}`

  return (
    <S.Card $invalid={!!issue} $section={!config.isInput}>
      <S.TopRow>
        <S.Number aria-hidden>{index + 1}</S.Number>
        <div>
          <FieldLabel htmlFor={id('label')}>{config.isInput ? COPY.questionLabel : COPY.headingLabel}</FieldLabel>
          <FieldInput
            id={id('label')}
            value={field.label}
            disabled={readOnly}
            placeholder={config.isInput ? COPY.questionPlaceholder : COPY.headingPlaceholder}
            aria-invalid={!!issue || undefined}
            onChange={(e) => onChange({ label: e.target.value })}
          />
        </div>
        <S.TypeSlot>
          <FieldLabel htmlFor={id('type')}>{COPY.typeLabel}</FieldLabel>
          <FieldSelect
            id={id('type')}
            value={field.type}
            disabled={readOnly}
            onChange={(e) => onChange({ type: e.target.value as GuestFormFieldType })}
          >
            {FIELD_TYPE_ORDER.map((type) => (
              <option key={type} value={type}>
                {FIELD_TYPE_CONFIG[type].label}
              </option>
            ))}
          </FieldSelect>
        </S.TypeSlot>
      </S.TopRow>

      <S.Indented>
        {config.hasOptions && (
          <div>
            <FieldLabel htmlFor={id('options')}>
              {COPY.optionsLabel}
              <S.OptionsHint>{COPY.optionsHint}</S.OptionsHint>
            </FieldLabel>
            <FieldTextarea
              id={id('options')}
              value={field.optionsText}
              disabled={readOnly}
              rows={Math.min(Math.max(field.optionsText.split('\n').length, 2), 8)}
              onChange={(e) => onChange({ optionsText: e.target.value })}
            />
          </div>
        )}
        <div>
          <FieldLabel htmlFor={id('help')}>{COPY.helpLabel}</FieldLabel>
          <FieldInput
            id={id('help')}
            value={field.helpText}
            disabled={readOnly}
            placeholder={COPY.helpPlaceholder}
            onChange={(e) => onChange({ helpText: e.target.value })}
          />
        </div>
      </S.Indented>

      {issue && <S.Issue role="alert">{issue}</S.Issue>}

      {!readOnly && (
        <S.Toolbar>
          {config.isInput ? (
            <CheckboxRow>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onChange({ required: e.target.checked })}
              />
              {COPY.required}
            </CheckboxRow>
          ) : (
            <span />
          )}
          <S.Tools>
            <S.Tool type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label={`${COPY.moveUp}: ${field.label || `field ${index + 1}`}`}>
              ↑
            </S.Tool>
            <S.Tool type="button" onClick={() => onMove(1)} disabled={index === total - 1} aria-label={`${COPY.moveDown}: ${field.label || `field ${index + 1}`}`}>
              ↓
            </S.Tool>
            <S.Tool type="button" onClick={onDuplicate}>
              {COPY.duplicate}
            </S.Tool>
            <S.Tool type="button" $danger onClick={onRemove}>
              {COPY.remove}
            </S.Tool>
          </S.Tools>
        </S.Toolbar>
      )}
    </S.Card>
  )
}
