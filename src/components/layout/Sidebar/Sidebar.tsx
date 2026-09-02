"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { T } from "@/lib/theme";
import { useProfileStore } from "@/stores/profileStore";
import { useAdminStore } from "@/stores/adminStore";
import { useClientStore } from "@/stores/clientStore";
import * as S from "./Sidebar.styled";
import { NAV_SECTIONS, type NavItemConfig } from "./constants";

interface SidebarProps {
  activePath: string;
}

export default function Sidebar({ activePath }: SidebarProps) {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const client = useClientStore((s) => s.client);
  const isStaff = useAdminStore((s) => s.isAdmin);
  const checkAdmin = useAdminStore((s) => s.checkAdmin);

  useEffect(() => {
    if (client && isStaff === null) checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, isStaff]);

  const orgInitial = profile?.operator.name?.[0]?.toUpperCase() ?? "·";
  const orgName = profile?.operator.name ?? "···";
  const orgSlug = profile?.operator.slug ?? "";

  // Track which expandable items are open (by label)
  // Auto-open "Content" when the current path is under any of its sub-items
  function isSubItemActive(item: NavItemConfig) {
    return item.subItems?.some((s) => activePath.startsWith(s.href)) ?? false;
  }

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        if (item.subItems && item.subItems.some((s) => activePath.startsWith(s.href))) {
          initial[item.label] = true;
        }
      }
    }
    return initial;
  });

  // Keep auto-expanded when route changes
  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      for (const section of NAV_SECTIONS) {
        for (const item of section.items) {
          if (item.subItems && item.subItems.some((s) => activePath.startsWith(s.href))) {
            next[item.label] = true;
          }
        }
      }
      return next;
    });
  }, [activePath]);

  function toggle(label: string) {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <S.Aside>
      {NAV_SECTIONS.map(({ section, items }) => {
        const visible = items.filter(
          (item) =>
            (!item.ownerOnly || profile?.role === "OWNER") &&
            (!item.staffOnly || isStaff === true),
        );
        // Hide the whole section when nothing in it is visible — otherwise
        // operators would see an empty "Veldt Staff" heading.
        if (visible.length === 0) return null;

        return (
        <S.Section key={section}>
          <S.SectionLabel>{section}</S.SectionLabel>

          {visible
            .map((item) => {
            const hasSubItems = !!item.subItems?.length;
            const isOpen = expanded[item.label] ?? false;
            const subActive = isSubItemActive(item);
            // A parent item is "active" only when it has no sub-items and its href matches,
            // or when a sub-item is active (to show the highlight)
            const selfActive = hasSubItems
              ? subActive
              : activePath === item.href || activePath.startsWith(item.href + "/");

            return (
              <div key={item.label}>
                <S.NavItem
                  $active={selfActive}
                  onClick={() => {
                    if (hasSubItems) {
                      toggle(item.label);
                    } else {
                      router.push(item.href);
                    }
                  }}
                >
                  <Icon d={item.icon} color={selfActive ? T.terra : T.muted} size={14} />
                  {item.label}
                  {hasSubItems && (
                    <S.NavItemChevron
                      $open={isOpen}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </S.NavItemChevron>
                  )}
                </S.NavItem>

                {hasSubItems && (
                  <S.SubNavList $open={isOpen}>
                    {item.subItems!.map((sub) => {
                      const subIsActive = activePath.startsWith(sub.href);
                      return (
                        <S.SubNavItem
                          key={sub.href}
                          $active={subIsActive}
                          onClick={() => router.push(sub.href)}
                        >
                          {sub.label}
                        </S.SubNavItem>
                      );
                    })}
                  </S.SubNavList>
                )}
              </div>
            );
          })}
        </S.Section>
        );
      })}

      <S.OrgFooter>
        <S.OrgLabel>Tour Operator</S.OrgLabel>
        <S.OrgCard>
          <S.OrgLogo>{orgInitial}</S.OrgLogo>
          <div>
            <S.OrgName>{orgName}</S.OrgName>
            <S.OrgCity>{orgSlug}</S.OrgCity>
          </div>
        </S.OrgCard>
      </S.OrgFooter>
    </S.Aside>
  );
}
