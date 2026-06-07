import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'outline' | 'ghost'
  $disabled?: boolean
}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s;

  ${({ $variant = 'outline' }) =>
    $variant === 'primary'
      ? `
        background: ${T.terra};
        color: #fff;
        border: none;
        &:hover:not(:disabled) { background: #AE6341; }
      `
      : $variant === 'ghost'
        ? `
        background: transparent;
        color: ${T.sub};
        border: none;
        &:hover { background: ${T.dim}; }
      `
        : `
        background: transparent;
        color: ${T.sub};
        border: 1px solid ${T.border};
        &:hover { background: ${T.dim}; }
      `}
`
