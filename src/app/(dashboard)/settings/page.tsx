'use client'

import { UserProfile } from '@clerk/nextjs'
import { T } from '@/lib/theme'
import { useProfileStore } from '@/stores/profileStore'
import * as S from './page.styled'

const clerkAppearance = {
  variables: {
    colorPrimary: T.terra,
    colorBackground: T.card,
    colorText: T.text,
    colorTextSecondary: T.muted,
    colorInputBackground: T.card,
    colorInputText: T.text,
    borderRadius: '7px',
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '13px',
  },
  elements: {
    rootBox: { width: '100%' },
    card: {
      border: `1px solid ${T.border}`,
      boxShadow: 'none',
      borderRadius: '12px',
      width: '100%',
    },
    navbar: { display: 'none' },
    headerTitle: {
      fontFamily: '"Playfair Display", serif',
      fontSize: 20,
      fontWeight: 500,
    },
    formButtonPrimary: {
      backgroundColor: T.terra,
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
      fontSize: 13,
      textTransform: 'none' as const,
    },
    footerActionLink: { color: T.terra },
  },
}

export default function SettingsPage() {
  const profile = useProfileStore((s) => s.profile)

  return (
    <S.PageRoot>
      <S.PageTitle>Settings</S.PageTitle>

      {/* Operator info — read only */}
      {profile && (
        <S.Section>
          <S.SectionLabel>Your Organisation</S.SectionLabel>
          <S.Card>
            <S.CardRow>
              <div>
                <S.CardRowLabel>Operator name</S.CardRowLabel>
                <S.CardRowValue>{profile.operator.name}</S.CardRowValue>
              </div>
            </S.CardRow>
            <S.CardRow>
              <div>
                <S.CardRowLabel>Slug</S.CardRowLabel>
                <S.CardRowValue>{profile.operator.slug}</S.CardRowValue>
              </div>
            </S.CardRow>
            <S.CardRow>
              <div>
                <S.CardRowLabel>Your role</S.CardRowLabel>
                <S.CardRowValue>
                  <S.RoleBadge>
                    {profile.role.charAt(0) + profile.role.slice(1).toLowerCase()}
                  </S.RoleBadge>
                </S.CardRowValue>
              </div>
            </S.CardRow>
          </S.Card>
        </S.Section>
      )}

      {/* Clerk UserProfile — name, email, password, connected accounts */}
      <S.Section>
        <S.SectionLabel>Account</S.SectionLabel>
        <S.ClerkWrap>
          <UserProfile routing="hash" appearance={clerkAppearance} />
        </S.ClerkWrap>
      </S.Section>
    </S.PageRoot>
  )
}
