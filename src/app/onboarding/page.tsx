'use client'

import { useClerk } from '@clerk/nextjs'
import { T } from '@/lib/theme'
import {
  Root,
  Card,
  Logo,
  IconCircle,
  Title,
  Description,
  EmailLink,
  SignOutButton,
} from './page.styled'

export default function OnboardingPage() {
  const { signOut } = useClerk()

  return (
    <Root>
      <Card>
        <Logo>Veldt</Logo>

        <IconCircle>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke={T.terra}
            strokeWidth='2'
            strokeLinecap='round'
          >
            <path
              d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
              A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.4
              A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81
              a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.86-.86
              a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7
              A2 2 0 0 1 22 16.92z'
            />
          </svg>
        </IconCircle>

        <Title>Access pending</Title>

        <Description>
          Veldt is currently invite-only. If you've received an invitation,
          please use the link in your email to sign up.
          <br />
          <br />
          If you'd like access, contact us at{' '}
          <EmailLink href='mailto:hello@veldt.app'>hello@veldt.app</EmailLink>
        </Description>

        <SignOutButton onClick={() => signOut({ redirectUrl: '/sign-in' })}>
          Sign out
        </SignOutButton>
      </Card>
    </Root>
  )
}
