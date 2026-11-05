'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Frame = styled.figure`
  margin: 0;
  width: 100%;
  max-width: 340px;
  min-height: 600px;
  background: ${T.card};
  border: 1px solid ${T.borderStrong};
  border-radius: 36px;
  padding: 14px 16px 24px;
  box-shadow: 0 30px 60px -30px ${T.scrimDeep};
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-margin-top: 96px;
`

export const Notch = styled.div`
  align-self: center;
  width: 64px;
  height: 5px;
  border-radius: 999px;
  background: ${T.border};
`

export const Search = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 8px 8px 12px;
  border: 1px solid ${T.border};
  border-radius: 12px;
  font-size: 13px;
  color: ${T.text};
`

export const BuildChip = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 8px;
  background: ${T.text};
  color: ${T.onBrand};
`

export const Cover = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  padding: 14px 14px 12px;
  background: ${T.coverGradient};
  color: ${T.onBrand};
`

export const CoverArt = styled.svg`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 120px;
  height: 64px;
  color: ${T.onBrandFaint};
`

export const CoverMeta = styled.div`
  position: relative;
  font-size: 11px;
  color: ${T.onBrandMuted};
`

export const CoverTitle = styled.div`
  position: relative;
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 19px;
  margin-top: 2px;
`

export const Timeline = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0 0 0 14px;
  border-left: 1px solid ${T.borderStrong};
  margin-left: 5px;
`

export const Stop = styled.li`
  position: relative;
  padding: 9px 0 9px 4px;
  border-bottom: 1px solid ${T.border};

  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 13px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    border: 1.5px solid ${T.text};
    background: ${T.card};
  }
`

export const StopName = styled.div`
  font-size: 12.5px;
  font-weight: 600;
  color: ${T.text};
`

export const StopWhen = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-top: 2px;
`

export const Deposit = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid ${T.border};
  border-radius: 12px;
`

export const DepositLabel = styled.div`
  font-size: 12.5px;
  font-weight: 600;
  color: ${T.text};
`

export const DepositMeta = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 2px;
`

export const PayChip = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  padding: 7px 11px;
  border-radius: 8px;
  background: ${T.gold};
  color: ${T.onBrand};
  white-space: nowrap;
`
