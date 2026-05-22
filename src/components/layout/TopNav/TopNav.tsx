"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import * as S from "./TopNav.styled";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Itineraries", href: "/itineraries" },
  { label: "Calendar", href: "/calendar" },
  { label: "Clients", href: "/clients" },
  { label: "Financials", href: "/financials" },
  { label: "Library", href: "/library" },
];

interface TopNavProps {
  activePath: string;
}

export default function TopNav({ activePath }: TopNavProps) {
  const router = useRouter();
  const { user } = useUser();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "??";

  const operatorName = "Veldt DMC · Nairobi"; // TODO: pull from operator store

  return (
    <S.Nav>
      <S.LogoWrap>
        <S.LogoText>Veldt</S.LogoText>
        <S.LogoSub>Travel Operations</S.LogoSub>
      </S.LogoWrap>

      <S.Links>
        {NAV_LINKS.map((item) => (
          <S.NavLink
            key={item.label}
            $active={activePath === item.href}
            onClick={() => router.push(item.href)}
          >
            {item.label}
          </S.NavLink>
        ))}
      </S.Links>

      <S.RightControls>
        <S.OperatorChip>{operatorName}</S.OperatorChip>

        <S.NewBtn onClick={() => router.push("/itineraries/new")}>
          <S.PlusIcon>+</S.PlusIcon>
          New Itinerary
        </S.NewBtn>

        <S.Avatar>{initials}</S.Avatar>
      </S.RightControls>
    </S.Nav>
  );
}
