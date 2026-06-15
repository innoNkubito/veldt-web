"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Icon from "@/components/ui/Icon";
import { T } from "@/lib/theme";
import * as S from "./Sidebar.styled";
import { NAV_SECTIONS } from "./constants";

interface SidebarProps {
  activePath: string;
}

export default function Sidebar({ activePath }: SidebarProps) {
  const router = useRouter();
  const { user } = useUser();

  const orgInitial = "V"; // TODO: pull from operator store
  const orgName = "Veldt DMC";
  const orgCity = "Nairobi, Kenya";

  return (
    <S.Aside>
      {NAV_SECTIONS.map(({ section, items }) => (
        <S.Section key={section}>
          <S.SectionLabel>{section}</S.SectionLabel>

          {items.map(({ label, href, icon }) => {
            const active = activePath.startsWith(href);
            return (
              <S.NavItem
                key={label}
                $active={active}
                onClick={() => router.push(href)}
              >
                <Icon d={icon} color={active ? T.terra : T.muted} size={14} />
                {label}
              </S.NavItem>
            );
          })}
        </S.Section>
      ))}

      <S.OrgFooter>
        <S.OrgLabel>Organisation</S.OrgLabel>

        <S.OrgCard>
          <S.OrgLogo>{orgInitial}</S.OrgLogo>

          <div>
            <S.OrgName>{orgName}</S.OrgName>
            <S.OrgCity>{orgCity}</S.OrgCity>
          </div>

          <S.Chevron
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={T.muted}
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </S.Chevron>
        </S.OrgCard>
      </S.OrgFooter>
    </S.Aside>
  );
}
