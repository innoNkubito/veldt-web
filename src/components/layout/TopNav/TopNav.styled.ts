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
  user-select: none;
`;

export const AvatarWrap = styled.div`
  position: relative;
`;

export const AvatarDropdown = styled.div<{ $top: number; $right: number }>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  right: ${({ $right }) => $right}px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 220px;
  overflow: hidden;
`;

export const AvatarDropdownHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid ${T.border};
`;

export const AvatarDropdownName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${T.text};
  line-height: 1.3;
`;

export const AvatarDropdownMeta = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 2px;
`;

export const AvatarDropdownItem = styled.button`
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 13px;
  color: ${T.sub};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${T.dim};
  }
`;

export const AvatarDropdownDivider = styled.div`
  border-top: 1px solid ${T.border};
`;

export const AvatarDropdownSignOut = styled(AvatarDropdownItem)`
  color: #dc2626;
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
`;
