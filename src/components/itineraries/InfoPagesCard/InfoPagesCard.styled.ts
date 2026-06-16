import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 24px 28px;
  grid-column: 1 / -1;
`

export const CardTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${T.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${T.border};
`

export const CardDescription = styled.p`
  font-size: 12px;
  color: ${T.muted};
  margin: 0 0 24px;
  line-height: 1.5;
`

// ── Slot section ────────────────────────────────────────────────

export const SlotSection = styled.div`
  & + & {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid ${T.border};
  }
`

export const SlotHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
`

export const SlotLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${T.text};
`

export const SlotHint = styled.span`
  font-size: 11.5px;
  color: ${T.muted};
`

// ── Selected pages ──────────────────────────────────────────────

export const SelectedPages = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
`

export const PagePill = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 10px;
  background: #f0ebe4;
  border-radius: 20px;
  font-size: 12px;
  color: #3d2b1f;
  font-weight: 500;
`

export const PillType = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #8a6a50;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const PillRemove = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  background: #c5b09a;
  color: #fff;
  font-size: 10px;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;

  &:hover { background: #a0826a; }
`

export const PillMoveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: none;
  background: none;
  color: #8a6a50;
  font-size: 10px;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;

  &:hover { background: #c5b09a; color: #fff; }
  &:disabled { opacity: 0.3; cursor: default; }
`

// ── Add page picker ─────────────────────────────────────────────

export const AddRow = styled.div`
  position: relative;
  display: inline-block;
`

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 12px;
  border: 1px dashed ${T.border};
  border-radius: 6px;
  background: none;
  font-size: 12px;
  color: ${T.muted};
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: #b8a898;
    color: ${T.text};
  }
`

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 280px;
  background: #fff;
  border: 1px solid ${T.border};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  z-index: 50;
  overflow: hidden;
`

export const DropdownSearch = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border: none;
  border-bottom: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: #bbb; }
`

export const DropdownList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`

export const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 12px;
  border: none;
  background: none;
  text-align: left;
  font-size: 12.5px;
  color: ${T.text};
  cursor: pointer;

  &:hover { background: #faf7f4; }
`

export const DropdownItemThumb = styled.div<{ $url: string }>`
  width: 36px;
  height: 28px;
  border-radius: 4px;
  background: ${({ $url }) => $url ? `url(${$url}) center/cover` : T.dim};
  border: 1px solid ${T.border};
  flex-shrink: 0;
`

export const DropdownItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const DropdownItemName = styled.div`
  font-size: 12.5px;
  color: ${T.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const DropdownItemType = styled.span`
  font-size: 10px;
  color: ${T.muted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const DropdownEmpty = styled.div`
  padding: 14px 12px;
  font-size: 12px;
  color: ${T.muted};
  text-align: center;
`
