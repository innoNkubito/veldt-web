import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Root = styled.div`
  position: relative;
  margin-top: 10px;
`

export const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const SearchInput = styled.input`
  flex: 1;
  padding: 7px 11px;
  border-radius: 6px;
  border: 1px solid ${T.border};
  font-size: 12.5px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${T.terra};
  }
`

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.10);
  z-index: 30;
  max-height: 220px;
  overflow-y: auto;
`

export const DropdownItem = styled.div<{ $active?: boolean }>`
  padding: 9px 14px;
  font-size: 13px;
  color: ${({ $active }) => ($active ? T.terra : T.text)};
  background: ${({ $active }) => ($active ? T.terraLt : 'transparent')};
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${T.dim};
    color: ${T.terra};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${T.border};
  }
`

export const RoomRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 6px;
`

export const RoomSelect = styled.select`
  flex: 1;
  padding: 7px 11px;
  border-radius: 6px;
  border: 1px solid ${T.border};
  font-size: 12.5px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
`
