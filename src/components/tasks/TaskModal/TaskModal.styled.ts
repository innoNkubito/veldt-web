import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(42, 31, 20, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`

export const Card = styled.div`
  width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  background: ${T.card};
  border-radius: 12px;
  border: 1px solid ${T.border};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px 16px;
`

export const Title = styled.div`
  font-family: var(--font-playfair);
  font-size: 20px;
  font-weight: 500;
  color: ${T.text};
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${T.sub};
  font-size: 18px;
  line-height: 1;
  padding: 4px;
  &:hover { color: ${T.text}; }
`

export const Body = styled.div`
  padding: 8px 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const TextInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;

  &::placeholder { color: ${T.muted}; }
  &:focus { border-color: ${T.terra}; }
`

// ── Dropdown ──────────────────────────────────────────────────

export const DropdownWrap = styled.div`
  position: relative;
`

export const DropdownButton = styled.button<{ $placeholder?: boolean }>`
  width: 100%;
  padding: 12px 40px 12px 14px;
  border-radius: 8px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${({ $placeholder }) => ($placeholder ? T.muted : T.text)};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
  text-align: left;
  cursor: pointer;
  position: relative;

  &:focus { border-color: ${T.terra}; }
`

export const DropdownChevron = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${T.sub};
  display: flex;
  align-items: center;
  pointer-events: none;
`

export const DropdownList = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 20;
  max-height: 220px;
  overflow-y: auto;
`

export const DropdownItem = styled.button<{ $highlight?: boolean }>`
  display: block;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: ${({ $highlight }) => ($highlight ? T.dim : 'transparent')};
  text-align: left;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: ${T.text};
  cursor: pointer;

  &:hover { background: ${T.dim}; }
`

export const DropdownEmpty = styled.div`
  padding: 10px 14px;
  font-size: 12.5px;
  color: ${T.muted};
`

// ── Tags ──────────────────────────────────────────────────────

export const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  width: 100%;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${T.border};
  background: ${T.card};
  box-sizing: border-box;

  &:focus-within { border-color: ${T.terra}; }
`

export const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 500;
  background: ${T.dim};
  color: ${T.sub};
  border: 1px solid ${T.border};
`

export const TagRemove = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${T.muted};
  font-size: 12px;
  padding: 0;
  line-height: 1;
  &:hover { color: #dc2626; }
`

export const TagInput = styled.input`
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  font-size: 13px;
  color: ${T.text};
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  padding: 4px 0;

  &::placeholder { color: ${T.muted}; }
`

// ── Relative due date row ─────────────────────────────────────

export const RelativeRow = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 13.5px;
  color: ${T.text};
  opacity: ${({ $disabled }) => ($disabled ? 0.45 : 1)};
`

export const RelativeDaysInput = styled.input`
  width: 52px;
  padding: 5px 8px;
  border-radius: 6px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  text-align: center;
  outline: none;
  font-family: 'DM Sans', sans-serif;

  &:focus { border-color: ${T.terra}; }
`

export const ToggleChip = styled.button`
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px dashed ${T.border};
  background: ${T.bg};
  font-size: 12.5px;
  color: ${T.text};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.12s, background 0.12s;

  &:hover {
    border-color: ${T.terra};
    background: ${T.terraLt};
  }
`

// ── Calendar ──────────────────────────────────────────────────

export const CalendarWrap = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 20;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
  padding: 14px;
  width: 300px;
`

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`

export const CalendarSelect = styled.select`
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid ${T.border};
  font-size: 12.5px;
  color: ${T.text};
  background: ${T.card};
  font-family: 'DM Sans', sans-serif;
  outline: none;
  cursor: pointer;
`

export const CalendarNav = styled.div`
  margin-left: auto;
  display: flex;
  gap: 4px;
`

export const CalendarNavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${T.sub};
  padding: 3px 6px;
  border-radius: 5px;
  font-size: 13px;
  &:hover { background: ${T.dim}; color: ${T.text}; }
`

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`

export const CalendarDayLabel = styled.div`
  font-size: 9.5px;
  font-weight: 700;
  color: ${T.muted};
  text-transform: uppercase;
  text-align: center;
  padding: 4px 0;
`

export const CalendarDay = styled.button<{ $today?: boolean; $selected?: boolean; $blank?: boolean }>`
  padding: 6px 0;
  border: none;
  border-radius: 6px;
  background: ${({ $selected }) => ($selected ? T.terra : 'transparent')};
  color: ${({ $selected, $today }) => ($selected ? '#fff' : $today ? '#1a7a3a' : T.text)};
  font-weight: ${({ $today, $selected }) => ($today || $selected ? 700 : 400)};
  font-size: 12.5px;
  font-family: 'DM Sans', sans-serif;
  cursor: ${({ $blank }) => ($blank ? 'default' : 'pointer')};
  visibility: ${({ $blank }) => ($blank ? 'hidden' : 'visible')};

  &:hover { background: ${({ $selected }) => ($selected ? T.terra : T.dim)}; }
`

export const SelectedDateNote = styled.div`
  font-size: 12px;
  color: ${T.sub};
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ClearDateButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${T.terra};
  font-size: 12px;
  padding: 0;
  text-decoration: underline;
  font-family: 'DM Sans', sans-serif;
`

// ── Footer ────────────────────────────────────────────────────

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 32px 24px;
  border-top: 1px solid ${T.border};
`

export const SubmitButton = styled.button<{ $disabled?: boolean }>`
  padding: 10px 26px;
  border-radius: 20px;
  border: none;
  background: ${({ $disabled }) => ($disabled ? T.muted : '#1a7a3a')};
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  font-family: 'DM Sans', sans-serif;

  &:hover { background: ${({ $disabled }) => ($disabled ? T.muted : '#166531')}; }
`

export const ErrorText = styled.div`
  font-size: 12.5px;
  color: #dc2626;
`
