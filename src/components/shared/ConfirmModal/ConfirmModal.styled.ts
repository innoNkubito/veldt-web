import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { T } from '@/lib/theme'

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const popIn = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(42, 31, 20, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: ${fadeIn} 0.15s ease;
`

export const Card = styled.div`
  width: 420px;
  background: ${T.card};
  border-radius: 12px;
  padding: 28px 32px 24px;
  border: 1px solid ${T.border};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
  animation: ${popIn} 0.18s ease;
`

export const Title = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 500;
  color: ${T.text};
  margin-bottom: 8px;
`

export const Message = styled.div`
  font-size: 13.5px;
  line-height: 1.6;
  color: ${T.sub};
  margin-bottom: 24px;
`

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`

export const CancelButton = styled.button`
  padding: 9px 20px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  background: transparent;
  font-size: 13px;
  color: ${T.sub};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: ${T.dim};
    color: ${T.text};
  }
`

export const ConfirmButton = styled.button<{ $danger?: boolean }>`
  padding: 9px 22px;
  border-radius: 7px;
  border: none;
  background: ${({ $danger }) => ($danger ? '#dc2626' : T.terra)};
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: filter 0.12s;

  &:hover { filter: brightness(0.92); }
`
