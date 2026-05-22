import styled from "@emotion/styled";
import { T } from "@/lib/theme";

export const Nav = styled.nav`
  height: 56px;
  background: ${T.navBg};
  border-bottom: 1px solid ${T.border};
  display: flex;
  align-items: center;
  padding: 0 24px;
  flex-shrink: 0;
`;

export const LogoWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 48px;
  user-select: none;
`;

export const LogoText = styled.span`
  font-family: var(--font-playfair);
  font-size: 20px;
  font-weight: 700;
  color: ${T.text};
  letter-spacing: 2px;
  text-transform: uppercase;
  line-height: 1.1;
`;

export const LogoSub = styled.span`
  font-size: 8.5px;
  font-weight: 600;
  color: ${T.muted};
  letter-spacing: 2.5px;
  text-transform: uppercase;
`;

export const Links = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  align-items: center;
`;

export const NavLink = styled.div<{ $active: boolean }>`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 13px;
  cursor: pointer;
  color: ${({ $active }) => ($active ? T.terra : T.sub)};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  border-bottom: 2px solid
    ${({ $active }) => ($active ? T.terra : "transparent")};
  transition: color 0.15s;
`;

export const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const OperatorChip = styled.div`
  font-size: 11px;
  color: ${T.muted};
  background: ${T.dim};
  padding: 5px 11px;
  border-radius: 6px;
  font-weight: 500;
`;

export const NewBtn = styled.button`
  background: ${T.terra};
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 8px 18px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const PlusIcon = styled.span`
  font-size: 16px;
  line-height: 1;
  margin-top: -1px;
`;

export const Avatar = styled.div`
  width: 33px;
  height: 33px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e8c98a, #c4704a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  cursor: pointer;
`;
