"use client";

import { usePathname } from "next/navigation";
import TopNav from "@/components/layout/TopNav";
import Sidebar from "@/components/layout/Sidebar";
import * as S from "./layout.styled";

// Routes that get a full-width, sidebar-free layout
const FULL_WIDTH_PATTERN = /^\/library\/(properties|areas|activities|about-us|introductory-notes)\/[^/]+/

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const fullWidth = FULL_WIDTH_PATTERN.test(pathname)

  return (
    <S.Shell>
      {!fullWidth && <TopNav activePath={pathname} />}
      <S.Body>
        {!fullWidth && <Sidebar activePath={pathname} />}
        <S.Main>{children}</S.Main>
      </S.Body>
    </S.Shell>
  );
}
