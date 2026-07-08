"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useProfileStore } from "@/stores/profileStore";
import * as S from "./TopNav.styled";

interface TopNavProps {
  activePath: string;
}

export default function TopNav({ activePath: _activePath }: TopNavProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const profile = useProfileStore((s) => s.profile);

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const avatarRef = useRef<HTMLDivElement>(null);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "··";

  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    user?.fullName ||
    "Account";

  const operatorName = profile?.operator?.name ?? "···";

  function handleAvatarClick() {
    if (!open && avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
    }
    setOpen((o) => !o);
  }

  return (
    <S.Nav>
      <S.LogoWrap>
        <S.LogoText>Veldt</S.LogoText>
        <S.LogoSub>Travel Operations</S.LogoSub>
      </S.LogoWrap>

      <S.RightControls>
        <S.OperatorChip>{operatorName}</S.OperatorChip>

        <S.AvatarWrap>
          <S.Avatar ref={avatarRef} onClick={handleAvatarClick}>
            {initials}
          </S.Avatar>

          {open && (
            <>
              <S.Backdrop onClick={() => setOpen(false)} />
              <S.AvatarDropdown $top={pos.top} $right={pos.right}>
                <S.AvatarDropdownHeader>
                  <S.AvatarDropdownName>{fullName}</S.AvatarDropdownName>
                  {profile && (
                    <S.AvatarDropdownMeta>
                      {profile.operator.name}
                      {" · "}
                      {profile.role.charAt(0) + profile.role.slice(1).toLowerCase()}
                    </S.AvatarDropdownMeta>
                  )}
                </S.AvatarDropdownHeader>

                <S.AvatarDropdownItem
                  onClick={() => { setOpen(false); router.push("/settings"); }}
                >
                  ⚙ Settings
                </S.AvatarDropdownItem>

                <S.AvatarDropdownDivider />

                <S.AvatarDropdownSignOut
                  onClick={() => signOut({ redirectUrl: "/sign-in" })}
                >
                  ↪ Sign out
                </S.AvatarDropdownSignOut>
              </S.AvatarDropdown>
            </>
          )}
        </S.AvatarWrap>
      </S.RightControls>
    </S.Nav>
  );
}
