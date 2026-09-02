import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Root = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  padding: 48px 24px 80px;
`

export const Shell = styled.div`
  max-width: 720px;
  margin: 0 auto;
`

export const Logo = styled.div`
  font-family: var(--font-playfair);
  font-size: 22px;
  font-weight: 500;
  color: ${T.terra};
  margin-bottom: 32px;
`

export const Title = styled.h1`
  font-family: var(--font-playfair);
  font-size: 30px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 8px;
  line-height: 1.15;
`

export const Intro = styled.p`
  font-size: 14.5px;
  line-height: 1.7;
  color: ${T.sub};
  margin: 0 0 32px;
  max-width: 560px;
`

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 26px 28px;
  margin-bottom: 16px;
`

export const SectionTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${T.muted};
  margin-bottom: 16px;
`

export const Grid = styled.div`
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

export const Label = styled.label`
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
  min-height: 88px;

  &:focus { border-color: ${T.terra}; }
`

// ── Plan picker ───────────────────────────────────────────────

export const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
`

export const PlanCard = styled.button<{ $active: boolean }>`
  text-align: left;
  padding: 15px 16px;
  border-radius: 10px;
  border: 1.5px solid ${({ $active }) => ($active ? T.terra : T.border)};
  background: ${({ $active }) => ($active ? T.terraLt : T.card)};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.12s, background 0.12s;

  &:hover { border-color: ${T.terra}; }
`

export const PlanName = styled.div<{ $active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? T.terra : T.text)};
`

export const PlanSeats = styled.div`
  font-size: 11.5px;
  font-weight: 500;
  color: ${T.sub};
  margin-top: 4px;
`

export const PlanDesc = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 6px;
  line-height: 1.45;
`

export const IntervalRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const IntervalChip = styled.button<{ $active: boolean }>`
  padding: 9px 16px;
  border-radius: 8px;
  border: 1.5px solid ${({ $active }) => ($active ? T.terra : T.border)};
  background: ${({ $active }) => ($active ? T.terraLt : T.card)};
  color: ${({ $active }) => ($active ? T.terra : T.sub)};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.12s, background 0.12s;
`

// ── Actions / states ──────────────────────────────────────────

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 20px;
`

export const SubmitButton = styled.button<{ $disabled?: boolean }>`
  padding: 14px 32px;
  border-radius: 8px;
  border: none;
  background: ${({ $disabled }) => ($disabled ? T.muted : T.terra)};
  color: #fff;
  font-size: 14.5px;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  font-family: 'DM Sans', sans-serif;

  &:hover:not(:disabled) { background: #AE6341; }
`

export const FinePrint = styled.div`
  font-size: 12px;
  color: ${T.muted};
  line-height: 1.55;
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
  margin: 0 auto 22px;
`

export const CenteredTitle = styled.h1`
  font-family: var(--font-playfair);
  font-size: 27px;
  font-weight: 500;
  color: ${T.text};
  text-align: center;
  margin: 0 0 12px;
`

export const CenteredBody = styled.div`
  font-size: 14px;
  color: ${T.sub};
  text-align: center;
  line-height: 1.7;
`

export const StepList = styled.ol`
  margin: 26px auto 0;
  padding-left: 20px;
  max-width: 420px;
  font-size: 13.5px;
  color: ${T.sub};
  line-height: 1.75;
`
