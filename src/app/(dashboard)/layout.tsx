"use client";

import { usePathname } from "next/navigation";
import TopNav from "@/components/layout/TopNav";
import Sidebar from "@/components/layout/Sidebar";
import * as S from "./layout.styled";

// Routes that get a full-width, sidebar-free layout (no TopNav either)
const FULL_WIDTH_PATTERN = /^\/library\/(properties|areas|activities|about-us|introductory-notes|terms-and-conditions)\/[^/]+/

// Routes that hide only the sidebar (TopNav stays)
const HIDE_SIDEBAR_PATTERN = /^\/itineraries\/[^/]+/

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const fullWidth = FULL_WIDTH_PATTERN.test(pathname)
  const hideSidebar = fullWidth || HIDE_SIDEBAR_PATTERN.test(pathname)

  return (
    <S.Shell>
      {!fullWidth && <TopNav activePath={pathname} />}
      <S.Body>
        {!hideSidebar && <Sidebar activePath={pathname} />}
        <S.Main>{children}</S.Main>
      </S.Body>
    </S.Shell>
  );
}
