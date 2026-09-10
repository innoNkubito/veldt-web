import styled from "@emotion/styled";
import { T } from "@/lib/theme";

export const Screen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${T.bg};
`;

export const Card = styled.div`
  width: 100%;
  max-width: 30rem;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 2.25rem 2.25rem 2rem;
  text-align: center;
`;

export const Mark = styled.div`
  font-family: var(--font-playfair), "Playfair Display", serif;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${T.terra};
  margin-bottom: 1.75rem;
`;

export const Title = styled.h1`
  font-family: var(--font-playfair), "Playfair Display", serif;
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 1.2;
  color: ${T.text};
  margin: 0 0 0.75rem;
`;

export const Body = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${T.sub};
  margin: 0 0 1rem;
`;

export const Identity = styled.div`
  display: inline-block;
  font-size: 0.8125rem;
  color: ${T.sub};
  background: ${T.dim};
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  margin-bottom: 1.5rem;
  word-break: break-all;
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.625rem;
  justify-content: center;
  flex-wrap: wrap;
`;

export const Primary = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  border-radius: 7px;
  background: ${T.terra};
  color: ${T.onBrand};
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background: ${T.terraDk};
  }
`;

export const Secondary = styled.button`
  padding: 0.625rem 1.25rem;
  border-radius: 7px;
  border: 1px solid ${T.border};
  background: ${T.card};
  color: ${T.sub};
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    background: ${T.dim};
  }
`;

export const Footnote = styled.p`
  font-size: 0.75rem;
  color: ${T.muted};
  margin: 1.5rem 0 0;
  padding-top: 1.25rem;
  border-top: 1px solid ${T.border};
`;

export const Link = styled.a`
  color: ${T.terra};
  font-weight: 500;
`;
