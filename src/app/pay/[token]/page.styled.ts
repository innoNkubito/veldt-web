import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const PageRoot = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`

export const Card = styled.div`
  width: 100%;
  max-width: 460px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 14px;
  padding: 34px 34px 30px;
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.07);
`

export const Eyebrow = styled.div`
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: ${T.muted};
  margin-bottom: 10px;
`

export const Title = styled.h1`
  font-family: var(--font-playfair);
  font-size: 25px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 6px;
  line-height: 1.2;
`

export const Subtitle = styled.div`
  font-size: 13px;
  color: ${T.muted};
  margin-bottom: 26px;
`

export const AmountBlock = styled.div`
  text-align: center;
  padding: 22px 0 20px;
  border-top: 1px solid ${T.border};
  border-bottom: 1px solid ${T.border};
  margin-bottom: 20px;
`

export const AmountValue = styled.div`
  font-family: var(--font-playfair);
  font-size: 38px;
  font-weight: 500;
  color: ${T.text};
  line-height: 1;
`

export const AmountLabel = styled.div`
  font-size: 12.5px;
  color: ${T.muted};
  margin-top: 10px;
`

export const BreakdownRow = styled.div<{ $strong?: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 7px 0;
  font-size: 13px;
  color: ${({ $strong }) => ($strong ? T.text : T.sub)};
  font-weight: ${({ $strong }) => ($strong ? 600 : 400)};
  border-top: ${({ $strong }) => ($strong ? `1px solid ${T.border}` : 'none')};
  margin-top: ${({ $strong }) => ($strong ? '5px' : 0)};
  padding-top: ${({ $strong }) => ($strong ? '11px' : '7px')};
`

export const PayButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  padding: 15px;
  border-radius: 9px;
  border: none;
  background: ${({ $disabled }) => ($disabled ? T.muted : T.terra)};
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  font-family: 'DM Sans', sans-serif;
  margin-top: 24px;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: #AE6341; }
`

export const SecureNote = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  text-align: center;
  margin-top: 14px;
  line-height: 1.5;
`

export const Banner = styled.div<{ $tone: 'error' | 'success' | 'info' }>`
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.55;
  margin-bottom: 20px;
  background: ${({ $tone }) =>
    $tone === 'error' ? '#fbe9e9' : $tone === 'success' ? '#e5efe4' : '#f7edd8'};
  border: 1px solid
    ${({ $tone }) => ($tone === 'error' ? '#f3c6c6' : $tone === 'success' ? '#c3ddc0' : '#e5d3a6')};
  color: ${({ $tone }) =>
    $tone === 'error' ? '#b91c1c' : $tone === 'success' ? '#3d6b39' : '#7a5f16'};
`

export const StatusMark = styled.div<{ $tone: 'success' | 'neutral' }>`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: ${({ $tone }) => ($tone === 'success' ? T.sage : T.dim)};
  color: ${({ $tone }) => ($tone === 'success' ? '#fff' : T.muted)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  margin: 0 auto 18px;
`

export const CenteredText = styled.div`
  text-align: center;
  font-size: 13.5px;
  color: ${T.sub};
  line-height: 1.65;
`

export const CenteredState = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${T.muted};
  font-size: 14px;
  text-align: center;
  padding: 24px;
`
