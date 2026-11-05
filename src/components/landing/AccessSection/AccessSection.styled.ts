'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 56px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`

export const Lead = styled.p`
  font-size: 18px;
  line-height: 1.55;
  color: ${T.sub};
  margin: 0 0 28px;
  max-width: 46ch;
`

export const Steps = styled.ol`
  list-style: none;
  margin: 0 0 32px;
  padding: 0 0 0 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  counter-reset: step;

  @media (max-width: 560px) {
    padding-left: 0;
  }
`

export const Step = styled.li`
  display: grid;
  grid-template-columns: 28px 1fr;
  column-gap: 12px;
  counter-increment: step;

  &::before {
    content: counter(step);
    grid-row: span 2;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1px solid ${T.text};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-playfair), 'Playfair Display', serif;
    font-size: 14px;
    color: ${T.text};
  }
`

export const StepTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${T.text};
  margin-bottom: 4px;
`

export const StepBody = styled.p`
  font-size: 15px;
  line-height: 1.55;
  color: ${T.sub};
  margin: 0;
`

export const Cta = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`

export const InviteNote = styled.span`
  font-size: 14px;
  color: ${T.muted};

  a {
    color: ${T.sub};
  }
`
