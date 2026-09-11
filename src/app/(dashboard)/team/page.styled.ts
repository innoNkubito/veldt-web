import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const PageRoot = styled.div`
  max-width: 840px;
  padding: 40px 32px;
`

export const PageHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
`

export const PageTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 6px;
`

export const PageSub = styled.p`
  font-size: 13px;
  color: ${T.sub};
  margin: 0;
  line-height: 1.5;
`

export const Section = styled.div`
  margin-bottom: 36px;
`

export const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 14px;
`

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  overflow: hidden;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border-bottom: 1px solid ${T.border};

  &:last-child {
    border-bottom: none;
  }
`

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${T.terraLt};
  color: ${T.terra};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
  font-weight: 700;
  flex-shrink: 0;
`

export const RowMain = styled.div`
  flex: 1;
  min-width: 0;
`

export const RowName = styled.div`
  font-size: 13.5px;
  font-weight: 500;
  color: ${T.text};
  display: flex;
  align-items: center;
  gap: 8px;
`

export const RowMeta = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

export const RoleBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  background: ${T.dim};
  color: ${T.terra};
  padding: 3px 9px;
  border-radius: 5px;
  letter-spacing: 0.05em;
`

export const YouTag = styled.span`
  font-size: 10.5px;
  font-weight: 600;
  color: ${T.muted};
  letter-spacing: 0.05em;
`

export const PendingTag = styled.span`
  font-size: 11px;
  font-weight: 600;
  background: ${T.warningLt};
  color: ${T.warningDk};
  border: 1px solid ${T.warningBd};
  padding: 2px 8px;
  border-radius: 5px;
`

// ── Seat meter ──────────────────────────────────────────────────

export const SeatCard = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 18px 20px;
`

export const SeatHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
`

export const SeatCount = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${T.text};
`

export const SeatNote = styled.div`
  font-size: 12px;
  color: ${T.muted};
`

export const SeatTrack = styled.div`
  height: 7px;
  border-radius: 4px;
  background: ${T.dim};
  overflow: hidden;
  display: flex;
`

/**
 * Members and pending invitations are drawn as separate segments of one bar.
 * A single filled bar would say "3 of 3 used" to an owner who can see only
 * two colleagues, and the missing seat is the thing they need to find.
 */
export const SeatFill = styled.div<{ $pct: number; $tone: 'member' | 'pending' }>`
  width: ${(p) => p.$pct}%;
  background: ${(p) => (p.$tone === 'member' ? T.terra : T.warning)};
  transition: width 180ms ease;
`

export const SeatLegend = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 10px;
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: ${T.sub};
`

export const LegendSwatch = styled.span<{ $tone: 'member' | 'pending' | 'free' }>`
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: ${(p) =>
    p.$tone === 'member' ? T.terra : p.$tone === 'pending' ? T.warning : T.dim};
`

// ── Buttons ─────────────────────────────────────────────────────

export const PrimaryButton = styled.button`
  background: ${T.terra};
  color: ${T.onBrand};
  border: none;
  border-radius: 7px;
  padding: 9px 18px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${T.terraDk};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const GhostButton = styled.button`
  background: transparent;
  color: ${T.sub};
  border: 1px solid ${T.border};
  border-radius: 7px;
  padding: 6px 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover:not(:disabled) {
    border-color: ${T.borderStrong};
    color: ${T.text};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const DangerButton = styled(GhostButton)`
  color: ${T.danger};
  border-color: ${T.dangerBd};

  &:hover:not(:disabled) {
    background: ${T.dangerLt};
    border-color: ${T.danger};
    color: ${T.dangerDk};
  }
`

// ── Modal ───────────────────────────────────────────────────────

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${T.scrim};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 60;
`

export const Modal = styled.div`
  background: ${T.card};
  border-radius: 14px;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 26px;
`

export const ModalTitle = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 19px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 6px;
`

export const ModalSub = styled.p`
  font-size: 12.5px;
  color: ${T.sub};
  line-height: 1.5;
  margin: 0 0 20px;
`

export const FieldGroup = styled.div`
  margin-bottom: 16px;
`

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

export const FieldLabel = styled.label`
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  color: ${T.sub};
  margin-bottom: 6px;
`

export const FieldInput = styled.input`
  width: 100%;
  border: 1px solid ${T.border};
  border-radius: 7px;
  padding: 9px 11px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};

  &:focus {
    outline: none;
    border-color: ${T.terra};
  }
`

export const FieldTextarea = styled.textarea`
  width: 100%;
  border: 1px solid ${T.border};
  border-radius: 7px;
  padding: 9px 11px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  resize: vertical;
  min-height: 72px;

  &:focus {
    outline: none;
    border-color: ${T.terra};
  }
`

export const RoleOption = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  border: 1px solid ${(p) => (p.$active ? T.terra : T.border)};
  background: ${(p) => (p.$active ? T.terraLt : T.card)};
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;

  &:last-child {
    margin-bottom: 0;
  }
`

export const RoleOptionName = styled.div<{ $active: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => (p.$active ? T.terra : T.text)};
`

export const RoleOptionDesc = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 2px;
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
`

// ── Feedback ────────────────────────────────────────────────────

export const ResultLine = styled.div<{ $ok: boolean }>`
  font-size: 12.5px;
  line-height: 1.5;
  color: ${(p) => (p.$ok ? T.successDk : T.dangerDk)};
  background: ${(p) => (p.$ok ? T.successLt : T.dangerLt)};
  border: 1px solid ${(p) => (p.$ok ? T.successBd : T.dangerBd)};
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 14px;
`

export const InviteLinkBox = styled.div`
  background: ${T.dim};
  border: 1px solid ${T.border};
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 14px;
`

export const InviteLinkLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 6px;
`

export const InviteLink = styled.a`
  font-size: 11.5px;
  color: ${T.teal};
  word-break: break-all;
  line-height: 1.45;
  display: block;
`

export const EmptyState = styled.div`
  font-size: 13px;
  color: ${T.muted};
  padding: 22px 20px;
  text-align: center;
`

export const Hint = styled.p`
  font-size: 12px;
  color: ${T.muted};
  line-height: 1.55;
  margin: 10px 0 0;
`
