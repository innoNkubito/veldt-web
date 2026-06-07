import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Root = styled.div`
  padding: 80px 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

export const IconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${T.dim};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${T.text};
  margin-bottom: 6px;
`

export const Text = styled.div`
  font-size: 13px;
  color: ${T.muted};
`

export const CreateButton = styled.button`
  margin-top: 8px;
  padding: 10px 22px;
  border-radius: 7px;
  border: none;
  background: ${T.terra};
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
`
