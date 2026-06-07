import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Wrapper = styled.div`
  position: relative;
`

export const Trigger = styled.button<{ $open: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${T.border};
  background: ${({ $open }) => ($open ? T.dim : 'transparent')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${T.muted};
  font-size: 16px;
`

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10;
`

export const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 32px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 20;
  min-width: 160px;
  overflow: hidden;
`

export const Item = styled.div<{ $color?: string }>`
  padding: 10px 16px;
  font-size: 13px;
  color: ${({ $color }) => $color ?? T.sub};
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${T.dim};
  }
`
