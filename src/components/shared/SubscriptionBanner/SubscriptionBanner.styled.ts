import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export type BannerTone = 'info' | 'warn' | 'danger'

const TONES: Record<BannerTone, { bg: string; border: string; text: string }> = {
  info: { bg: '#e8eef5', border: '#c8d8e8', text: '#2f5479' },
  warn: { bg: '#f7edd8', border: '#e5d3a6', text: '#7a5f16' },
  danger: { bg: '#fbe9e9', border: '#f3c6c6', text: '#b91c1c' },
}

export const Bar = styled.div<{ $tone: BannerTone }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 20px;
  font-size: 13px;
  line-height: 1.5;
  background: ${({ $tone }) => TONES[$tone].bg};
  border-bottom: 1px solid ${({ $tone }) => TONES[$tone].border};
  color: ${({ $tone }) => TONES[$tone].text};
`

export const Message = styled.div`
  flex: 1;
  min-width: 0;
`

export const Strong = styled.strong`
  font-weight: 600;
`

export const Action = styled.a<{ $tone: BannerTone }>`
  flex-shrink: 0;
  padding: 7px 16px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  background: ${({ $tone }) => TONES[$tone].text};
  color: #fff;

  &:hover { opacity: 0.9; }
`

export const SeatNote = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-top: 2px;
`
