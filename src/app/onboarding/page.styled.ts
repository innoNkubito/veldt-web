import styled from "@emotion/styled";
import { T } from "@/lib/theme";

export const Root = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Card = styled.div`
  width: 460px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 16px;
  padding: 48px 44px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
`;

export const Logo = styled.div`
  font-family: var(--font-playfair);
  font-size: 24px;
  font-weight: 700;
  color: ${T.text};
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 32px;
`;

export const IconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${T.terraLt};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

export const Title = styled.div`
  font-family: var(--font-playfair);
  font-size: 22px;
  font-weight: 500;
  color: ${T.text};
  margin-bottom: 12px;
`;

export const Description = styled.div`
  font-size: 13px;
  color: ${T.muted};
  line-height: 1.6;
  margin-bottom: 32px;
`;

export const EmailLink = styled.a`
  color: ${T.terra};
  text-decoration: none;
  font-weight: 500;
`;

export const SignOutButton = styled.button`
  padding: 10px 24px;
  background: transparent;
  border: 1px solid ${T.border};
  border-radius: 7px;
  font-size: 13px;
  color: ${T.sub};
  cursor: pointer;
`;
