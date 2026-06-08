"use client";

import { usePathname } from "next/navigation";
import TopNav from "@/components/layout/TopNav";
import Sidebar from "@/components/layout/Sidebar";
import * as S from "./layout.styled";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <S.Shell>
      <TopNav activePath={pathname} />
      <S.Body>
        <Sidebar activePath={pathname} />
        <S.Main>{children}</S.Main>
      </S.Body>
    </S.Shell>
  );
}
