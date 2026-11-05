'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 56px;
  align-items: start;

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
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  counter-reset: step;

`

export const Step = styled.li`
  display: grid;
  grid-template-columns: 30px 1fr;
  column-gap: 14px;
  counter-increment: step;

  &::before {
    content: counter(step);
    grid-row: span 2;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid ${T.text};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-playfair), 'Playfair Display', serif;
    font-size: 15px;
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

// Lines the card up with the title and keeps it in view while the steps
// scroll past (desktop only).
export const CardSlot = styled.div`
  position: sticky;
  top: 96px;
  margin-top: 32px;

  @media (max-width: 900px) {
    position: static;
    margin-top: 0;
  }
`
