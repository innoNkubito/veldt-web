"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useProfileStore } from "@/stores/profileStore";
import * as S from "./WorkspaceGate.styled";

/**
 * Stands between a signed-in Clerk account and the dashboard.
 *
 * A Clerk account with no OperatorUser row is a reachable state — a direct
 * sign-up, an invitation refused at the seat check, or a provisioning step
 * that half-completed. The API answers `me` with null rather than an error, so
 * every screen below degraded politely: the org name fell back to a
 * placeholder, the greeting came from Clerk, the itinerary list was simply
 * empty, and the banner built to explain such problems returned null because
 * there was no subscription to describe. The result rendered as a working, if
 * empty, account — so the people most in need of help had nothing to report.
 *
 * Platform admins legitimately have no operator, so they pass through to the
 * admin screens instead of being caught here.
 */
export default function WorkspaceGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = useProfileStore((s) => s.status);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const { user } = useUser();
  const { signOut } = useClerk();

  // 'idle' means TokenSync has not run yet; showing the dead-end screen during
  // that window would flash a false alarm on every page load.
  if (
    status === "idle" ||
    status === "loading" ||
    status === "ready" ||
    status === "staff"
  ) {
    return <>{children}</>;
  }

  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  if (status === "error") {
    return (
      <S.Screen>
        <S.Card>
          <S.Mark>Veldt</S.Mark>
          <S.Title>We couldn&apos;t reach Veldt</S.Title>
          <S.Body>
            Your account is fine — we just couldn&apos;t load your workspace.
            This is usually temporary.
          </S.Body>
          <S.Actions>
            <S.Secondary onClick={() => void fetchProfile()}>
              Try again
            </S.Secondary>
          </S.Actions>
        </S.Card>
      </S.Screen>
    );
  }

  return (
    <S.Screen>
      <S.Card>
        <S.Mark>Veldt</S.Mark>
        <S.Title>This account isn&apos;t linked to a workspace</S.Title>
        <S.Body>
          You&apos;re signed in, but this email isn&apos;t attached to any
          operator on Veldt. Nothing here is broken on your side — a workspace
          has to be set up for you before you can sign in.
        </S.Body>
        {email && <S.Identity>{email}</S.Identity>}
        <S.Body>
          If you were invited, the invitation may have been sent to a different
          address — sign out and use that one. If you asked for access,
          we&apos;ll email an invitation as soon as your workspace is ready.
        </S.Body>
        <S.Actions>
          <S.Primary href="/onboarding">Request access</S.Primary>
          <S.Secondary onClick={() => void signOut({ redirectUrl: "/" })}>
            Sign out
          </S.Secondary>
        </S.Actions>
        <S.Footnote>
          Already expecting access?{" "}
          <S.Link href="mailto:support@veldt.app">Email support</S.Link> and
          quote the address above.
        </S.Footnote>
      </S.Card>
    </S.Screen>
  );
}
