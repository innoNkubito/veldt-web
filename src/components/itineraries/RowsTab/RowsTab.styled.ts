import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Card = styled.div<{ $dragging?: boolean }>`
  background: ${T.card};
  border: 1px solid ${({ $dragging }) => ($dragging ? T.terra : T.border)};
  border-radius: 10px;
  padding: 18px 22px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: ${({ $dragging }) => ($dragging ? '0 4px 16px rgba(0,0,0,0.10)' : 'none')};

  &:hover {
    border-color: ${({ $dragging }) => ($dragging ? T.terra : '#D4C8B4')};
  }
`

export const DragHandle = styled.div`
  color: ${T.muted};
  cursor: grab;
  padding-top: 2px;
  font-size: 16px;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`

export const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`

export const DayLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${T.terra};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const SubText = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-top: 3px;
`

export const AccomRow = styled.div`
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
`

export const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: ${T.sub};
  background: ${T.dim};
  border-radius: 5px;
  padding: 3px 6px 3px 9px;
  margin-top: 6px;
  margin-right: 5px;
`

export const ChipRemove = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${T.muted};
  font-size: 10px;
  padding: 0 1px;
  line-height: 1;
  display: flex;
  align-items: center;
  border-radius: 3px;

  &:hover {
    color: #dc2626;
    background: rgba(220, 38, 38, 0.08);
  }
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`

export const IconButton = styled.button<{ $color?: string }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 7px;
  border-radius: 6px;
  color: ${({ $color }) => $color ?? T.muted};
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  transition: background 0.12s;

  &:hover {
    background: ${T.dim};
  }
`

export const AddRowButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 14px 20px;
  border-radius: 10px;
  border: 1.5px dashed ${T.border};
  background: transparent;
  font-size: 13px;
  color: ${T.muted};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  width: 100%;
  justify-content: center;
  transition: border-color 0.15s, color 0.15s, background 0.15s;

  &:hover {
    border-color: ${T.terra};
    color: ${T.terra};
    background: ${T.terraLt};
  }
`

export const AddAccomButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${T.muted};
  background: none;
  border: 1px dashed ${T.border};
  border-radius: 5px;
  padding: 3px 9px;
  margin-top: 8px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: color 0.12s, border-color 0.12s;

  &:hover {
    color: ${T.terra};
    border-color: ${T.terra};
  }
`

export const NightsText = styled.span`
  font-size: 11px;
  color: ${T.muted};
`

export const AreaChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: ${T.sub};
  background: #e4f0ea;
  border-radius: 5px;
  padding: 3px 6px 3px 9px;
  margin-top: 6px;
  margin-right: 5px;
`

export const ActivityChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: ${T.sub};
  background: #ede4f0;
  border-radius: 5px;
  padding: 3px 6px 3px 9px;
  margin-top: 6px;
  margin-right: 5px;
`

export const RowSection = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 0;
`

export const SectionAddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${T.muted};
  background: none;
  border: 1px dashed ${T.border};
  border-radius: 5px;
  padding: 3px 9px;
  margin-top: 6px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: color 0.12s, border-color 0.12s;

  &:hover {
    color: ${T.teal};
    border-color: ${T.teal};
  }
`

// Inline mini picker (shared by area + activity)
export const MiniPickerWrap = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 6px;
`

export const MiniPickerInput = styled.input`
  height: 28px;
  padding: 0 10px;
  border: 1px solid ${T.border};
  border-radius: 5px;
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  color: ${T.text};
  outline: none;
  width: 200px;

  &::placeholder { color: #bbb; }
  &:focus { border-color: ${T.teal}; }
`

export const MiniPickerDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 220px;
  background: #fff;
  border: 1px solid ${T.border};
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  z-index: 50;
  overflow: hidden;
  max-height: 180px;
  overflow-y: auto;
`

export const MiniPickerItem = styled.button`
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  font-size: 12.5px;
  color: ${T.text};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;

  &:hover { background: #faf7f4; }
`

export const MiniPickerEmpty = styled.div`
  padding: 10px 12px;
  font-size: 12px;
  color: ${T.muted};
`

export const MiniPickerCancel = styled.button`
  background: none;
  border: none;
  font-size: 11px;
  color: ${T.muted};
  cursor: pointer;
  margin-left: 6px;
  margin-top: 6px;
  font-family: 'DM Sans', sans-serif;

  &:hover { color: ${T.text}; }
`
