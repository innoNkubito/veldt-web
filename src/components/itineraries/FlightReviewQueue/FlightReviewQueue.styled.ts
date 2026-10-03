import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Card = styled.div`
  grid-column: 1 / -1;
  background: ${T.warningLt};
  border: 1px solid ${T.warning};
  border-radius: 10px;
  padding: 20px 24px;
`

export const Title = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${T.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
`

export const Intro = styled.p`
  font-size: 12.5px;
  color: ${T.sub};
  line-height: 1.5;
  margin: 0 0 14px;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 10px 14px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 8px;

  & + & {
    margin-top: 8px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`

export const Code = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${T.text};
`

export const Airline = styled.div`
  font-size: 11.5px;
  color: ${T.sub};
`

export const Line = styled.div`
  font-size: 13px;
  color: ${T.text};
`

export const Meta = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 2px;
`

export const Actions = styled.div`
  display: flex;
  gap: 6px;
`

export const ErrorText = styled.div`
  font-size: 12.5px;
  color: ${T.dangerDk};
  margin-top: 10px;
`
