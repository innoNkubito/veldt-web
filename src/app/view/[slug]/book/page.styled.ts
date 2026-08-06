import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const PageRoot = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  padding: 40px 24px 80px;
`

export const Shell = styled.div`
  max-width: 760px;
  margin: 0 auto;
`

export const BackLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${T.sub};
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  padding: 0 0 16px;
  &:hover { color: ${T.terra}; }
`

export const Title = styled.h1`
  font-family: var(--font-playfair);
  font-size: 30px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 6px;
  line-height: 1.15;
`

export const Subtitle = styled.div`
  font-size: 13.5px;
  color: ${T.muted};
  margin-bottom: 28px;
`

// ── Steps ─────────────────────────────────────────────────────

export const StepBar = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
`

export const StepPip = styled.div<{ $state: 'done' | 'active' | 'todo' }>`
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: ${({ $state }) =>
    $state === 'todo' ? T.border : $state === 'active' ? T.terra : T.sage};
  transition: background 0.2s;
`

export const StepLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${T.muted};
  margin-bottom: 14px;
`

// ── Cards ─────────────────────────────────────────────────────

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 24px 26px;
  margin-bottom: 16px;
`

export const CardTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${T.text};
  margin-bottom: 4px;
`

export const CardHint = styled.div`
  font-size: 12.5px;
  color: ${T.muted};
  line-height: 1.5;
  margin-bottom: 18px;
`

// ── Package / addon rows ──────────────────────────────────────

export const OptionRow = styled.div<{ $selected?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border-radius: 10px;
  border: 1.5px solid ${({ $selected }) => ($selected ? T.terra : T.border)};
  background: ${({ $selected }) => ($selected ? T.terraLt : T.card)};
  margin-bottom: 10px;
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
  transition: border-color 0.12s, background 0.12s;
`

export const OptionMain = styled.div`
  flex: 1;
  min-width: 0;
`

export const OptionName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${T.text};
`

export const OptionDesc = styled.div`
  font-size: 12.5px;
  color: ${T.sub};
  line-height: 1.55;
  margin-top: 5px;
`

export const OptionMeta = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 7px;
`

export const OptionPrice = styled.div`
  text-align: right;
  flex-shrink: 0;
`

export const PriceAmount = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${T.text};
  white-space: nowrap;
`

export const PriceUnit = styled.div`
  font-size: 10.5px;
  color: ${T.muted};
  margin-top: 2px;
`

export const SoldOutTag = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: ${T.dim};
  color: ${T.muted};
  margin-left: 8px;
`

// ── Quantity stepper ──────────────────────────────────────────

export const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
`

export const StepperButton = styled.button<{ $disabled?: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  background: ${T.card};
  color: ${({ $disabled }) => ($disabled ? T.muted : T.text)};
  font-size: 15px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  font-family: 'DM Sans', sans-serif;
  line-height: 1;

  &:hover:not(:disabled) { border-color: ${T.terra}; color: ${T.terra}; }
`

export const StepperValue = styled.div`
  width: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${T.text};
`

export const Checkbox = styled.input`
  width: 17px;
  height: 17px;
  margin-top: 2px;
  accent-color: ${T.terra};
  cursor: pointer;
  flex-shrink: 0;
`

// ── Fields ────────────────────────────────────────────────────

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`

export const FullRow = styled.div`
  grid-column: 1 / -1;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FieldLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: ${T.sub};
  text-transform: uppercase;
  letter-spacing: 0.8px;
`

export const Input = styled.input`
  width: 100%;
  padding: 11px 13px;
  border-radius: 8px;
  border: 1px solid ${T.border};
  font-size: 14px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;

  &:focus { border-color: ${T.terra}; }
  &::placeholder { color: ${T.muted}; }
`

export const Textarea = styled.textarea`
  width: 100%;
  padding: 11px 13px;
  border-radius: 8px;
  border: 1px solid ${T.border};
  font-size: 14px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
  resize: vertical;
  min-height: 84px;

  &:focus { border-color: ${T.terra}; }
`

// ── Summary ───────────────────────────────────────────────────

export const SummaryRow = styled.div<{ $strong?: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 9px 0;
  font-size: ${({ $strong }) => ($strong ? '15px' : '13.5px')};
  font-weight: ${({ $strong }) => ($strong ? 600 : 400)};
  color: ${({ $strong }) => ($strong ? T.text : T.sub)};
  border-top: ${({ $strong }) => ($strong ? `1px solid ${T.border}` : 'none')};
  margin-top: ${({ $strong }) => ($strong ? '6px' : '0')};
`

export const ScheduleRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid ${T.border};
  font-size: 13.5px;

  &:last-of-type { border-bottom: none; }
`

export const ScheduleDue = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 2px;
`

export const TermsBox = styled.div`
  max-height: 180px;
  overflow-y: auto;
  padding: 14px 16px;
  border: 1px solid ${T.border};
  border-radius: 8px;
  background: ${T.bg};
  font-size: 12.5px;
  line-height: 1.6;
  color: ${T.sub};
  margin-bottom: 14px;

  p { margin: 0 0 8px; }
  ul, ol { margin: 0 0 8px; padding-left: 20px; }
`

export const AcceptRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13.5px;
  color: ${T.text};
  cursor: pointer;
  line-height: 1.5;
`

// ── Actions ───────────────────────────────────────────────────

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
`

export const SecondaryButton = styled.button`
  padding: 12px 22px;
  border-radius: 8px;
  border: 1px solid ${T.border};
  background: transparent;
  font-size: 13.5px;
  color: ${T.sub};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;

  &:hover { background: ${T.dim}; color: ${T.text}; }
`

export const PrimaryButton = styled.button<{ $disabled?: boolean }>`
  margin-left: auto;
  padding: 13px 30px;
  border-radius: 8px;
  border: none;
  background: ${({ $disabled }) => ($disabled ? T.muted : T.terra)};
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  font-family: 'DM Sans', sans-serif;

  &:hover:not(:disabled) { background: #AE6341; }
`

export const ErrorBanner = styled.div`
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fbe9e9;
  border: 1px solid #f3c6c6;
  color: #b91c1c;
  font-size: 13px;
  line-height: 1.5;
`

export const CenteredState = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: ${T.muted};
  font-size: 14px;
  text-align: center;
`

// ── Confirmation ──────────────────────────────────────────────

export const SuccessMark = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${T.sage};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin: 0 auto 20px;
`

export const ConfirmTitle = styled.h1`
  font-family: var(--font-playfair);
  font-size: 27px;
  font-weight: 500;
  color: ${T.text};
  text-align: center;
  margin: 0 0 10px;
`

export const ConfirmBody = styled.div`
  font-size: 14px;
  color: ${T.sub};
  text-align: center;
  line-height: 1.65;
  margin-bottom: 26px;
`

export const ReferenceChip = styled.div`
  display: inline-block;
  padding: 7px 16px;
  border-radius: 8px;
  background: ${T.dim};
  border: 1px solid ${T.border};
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: ${T.text};
`
