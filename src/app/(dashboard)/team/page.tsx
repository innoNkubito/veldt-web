'use client'

import { useEffect, useState } from 'react'
import { useClientStore } from '@/stores/clientStore'
import { confirmDialog } from '@/stores/confirmStore'
import {
  useTeamStore,
  ASSIGNABLE_ROLES,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  type InviteOutcome,
  type SeatUsage,
  type TeamInvitation,
  type TeamMember,
  type UserRole,
} from '@/stores/teamStore'
import OperatorContactCard from './OperatorContactCard'
import OperatorBrandCard from './OperatorBrandCard'
import RemoveMemberModal from './RemoveMemberModal'
import * as S from './page.styled'
import { formatTimestamp } from '@/lib/dates'

function initials(first: string | null, last: string | null, fallback: string): string {
  const letters = [first?.[0], last?.[0]].filter(Boolean).join('')
  return (letters || fallback[0] || '?').toUpperCase()
}

function displayName(person: { firstName: string | null; lastName: string | null }): string | null {
  const name = [person.firstName, person.lastName].filter(Boolean).join(' ').trim()
  return name.length > 0 ? name : null
}

// ── Seat meter ──────────────────────────────────────────────────

/**
 * Members and pending invitations are shown separately.
 *
 * An owner looking at "3 of 3 seats" who can only count two colleagues has no
 * way to find the third — it is an invitation nobody has accepted. Splitting
 * the bar makes the missing seat something they can act on, which is the whole
 * reason revoking an invitation exists.
 */
function SeatMeter({ seats }: { seats: SeatUsage }) {
  if (seats.limit == null) {
    return (
      <S.SeatCard>
        <S.SeatHead>
          <S.SeatCount>
            {seats.members} {seats.members === 1 ? 'member' : 'members'}
          </S.SeatCount>
          <S.SeatNote>Unlimited seats</S.SeatNote>
        </S.SeatHead>
        {seats.pending > 0 && (
          <S.SeatNote>
            {seats.pending} {seats.pending === 1 ? 'invitation' : 'invitations'} awaiting a reply.
          </S.SeatNote>
        )}
      </S.SeatCard>
    )
  }

  const memberPct = Math.min(100, (seats.members / seats.limit) * 100)
  const pendingPct = Math.min(100 - memberPct, (seats.pending / seats.limit) * 100)

  return (
    <S.SeatCard>
      <S.SeatHead>
        <S.SeatCount>
          {seats.used} of {seats.limit} {seats.limit === 1 ? 'seat' : 'seats'} used
        </S.SeatCount>
        <S.SeatNote>
          {seats.remaining === 0
            ? 'No seats free'
            : `${seats.remaining} free`}
        </S.SeatNote>
      </S.SeatHead>

      <S.SeatTrack>
        <S.SeatFill $pct={memberPct} $tone="member" />
        <S.SeatFill $pct={pendingPct} $tone="pending" />
      </S.SeatTrack>

      <S.SeatLegend>
        <S.LegendItem>
          <S.LegendSwatch $tone="member" />
          {seats.members} joined
        </S.LegendItem>
        {seats.pending > 0 && (
          <S.LegendItem>
            <S.LegendSwatch $tone="pending" />
            {seats.pending} invited
          </S.LegendItem>
        )}
        <S.LegendItem>
          <S.LegendSwatch $tone="free" />
          {seats.remaining ?? 0} free
        </S.LegendItem>
      </S.SeatLegend>
    </S.SeatCard>
  )
}

// ── Invite modal ────────────────────────────────────────────────

function InviteModal({
  onClose,
  onDone,
}: {
  onClose: () => void
  onDone: (outcome: InviteOutcome) => void
}) {
  const invite = useTeamStore((s) => s.invite)
  const saving = useTeamStore((s) => s.saving)

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState<UserRole>('ADVISOR')
  const [error, setError] = useState<string | null>(null)

  async function handleInvite() {
    if (!email.trim()) {
      setError('An email address is required.')
      return
    }
    setError(null)

    const outcome = await invite({
      email: email.trim(),
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      role,
    })

    if (!outcome.ok) {
      setError(outcome.message)
      return
    }
    onDone(outcome)
  }

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(event) => event.stopPropagation()}>
        <S.ModalTitle>Invite a teammate</S.ModalTitle>
        <S.ModalSub>
          They receive an email with a link to set up their sign-in. The seat is held for them
          from now until they accept — revoke the invitation to get it back.
        </S.ModalSub>

        {error && <S.ResultLine $ok={false}>{error}</S.ResultLine>}

        <S.FieldGroup>
          <S.FieldLabel htmlFor="invite-email">Email address</S.FieldLabel>
          <S.FieldInput
            id="invite-email"
            type="email"
            value={email}
            placeholder="colleague@example.com"
            onChange={(event) => setEmail(event.target.value)}
          />
        </S.FieldGroup>

        <S.FieldGroup>
          <S.FieldRow>
            <div>
              <S.FieldLabel htmlFor="invite-first">First name</S.FieldLabel>
              <S.FieldInput
                id="invite-first"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div>
              <S.FieldLabel htmlFor="invite-last">Last name</S.FieldLabel>
              <S.FieldInput
                id="invite-last"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
          </S.FieldRow>
        </S.FieldGroup>

        <S.FieldGroup>
          <S.FieldLabel>Role</S.FieldLabel>
          {ASSIGNABLE_ROLES.map((option) => (
            <S.RoleOption
              key={option}
              type="button"
              $active={role === option}
              onClick={() => setRole(option)}
            >
              <S.RoleOptionName $active={role === option}>{ROLE_LABELS[option]}</S.RoleOptionName>
              <S.RoleOptionDesc>{ROLE_DESCRIPTIONS[option]}</S.RoleOptionDesc>
            </S.RoleOption>
          ))}
        </S.FieldGroup>

        <S.ModalActions>
          <S.GhostButton type="button" onClick={onClose} disabled={saving}>
            Cancel
          </S.GhostButton>
          <S.PrimaryButton type="button" onClick={handleInvite} disabled={saving}>
            {saving ? 'Sending…' : 'Send invitation'}
          </S.PrimaryButton>
        </S.ModalActions>
      </S.Modal>
    </S.Overlay>
  )
}

// ── Request seats modal ─────────────────────────────────────────

/**
 * The only upgrade path an operator has.
 *
 * Plan changes are platform-admin only, so an owner who has run out of seats
 * cannot buy their way past it — this puts the request in front of someone who
 * can, rather than leaving them to work out who to email.
 */
function RequestSeatsModal({
  onClose,
  onDone,
}: {
  onClose: () => void
  onDone: (message: string, sent: boolean) => void
}) {
  const requestSeats = useTeamStore((s) => s.requestSeats)
  const saving = useTeamStore((s) => s.saving)

  const [seats, setSeats] = useState('1')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleRequest() {
    const parsed = Number.parseInt(seats, 10)
    if (Number.isNaN(parsed) || parsed < 1) {
      setError('How many extra seats do you need?')
      return
    }
    setError(null)

    const result = await requestSeats(parsed, note.trim() || undefined)
    onDone(result.message, result.sent)
  }

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(event) => event.stopPropagation()}>
        <S.ModalTitle>Request more seats</S.ModalTitle>
        <S.ModalSub>
          This goes to the Veldt team, who will move you to a larger plan and confirm the change
          in price before anything is billed.
        </S.ModalSub>

        {error && <S.ResultLine $ok={false}>{error}</S.ResultLine>}

        <S.FieldGroup>
          <S.FieldLabel htmlFor="seat-count">How many extra seats?</S.FieldLabel>
          <S.FieldInput
            id="seat-count"
            type="number"
            min={1}
            max={50}
            value={seats}
            onChange={(event) => setSeats(event.target.value)}
          />
        </S.FieldGroup>

        <S.FieldGroup>
          <S.FieldLabel htmlFor="seat-note">Anything they should know? (optional)</S.FieldLabel>
          <S.FieldTextarea
            id="seat-note"
            value={note}
            placeholder="We are taking on two advisors before the season starts."
            onChange={(event) => setNote(event.target.value)}
          />
        </S.FieldGroup>

        <S.ModalActions>
          <S.GhostButton type="button" onClick={onClose} disabled={saving}>
            Cancel
          </S.GhostButton>
          <S.PrimaryButton type="button" onClick={handleRequest} disabled={saving}>
            {saving ? 'Sending…' : 'Send request'}
          </S.PrimaryButton>
        </S.ModalActions>
      </S.Modal>
    </S.Overlay>
  )
}

// ── Rows ────────────────────────────────────────────────────────

function MemberRow({
  member,
  canManage,
  onRemove,
}: {
  member: TeamMember
  canManage: boolean
  onRemove: (member: TeamMember) => void
}) {
  const saving = useTeamStore((s) => s.saving)
  const name = displayName(member)
  return (
    <S.Row>
      <S.Avatar>{initials(member.firstName, member.lastName, member.email ?? '?')}</S.Avatar>
      <S.RowMain>
        <S.RowName>
          {name ?? member.email ?? 'Unnamed'}
          {member.isYou && <S.YouTag>YOU</S.YouTag>}
        </S.RowName>
        <S.RowMeta>
          {member.email ?? 'No email on file'} · joined {formatTimestamp(member.joinedAt)}
        </S.RowMeta>
      </S.RowMain>
      <S.RowActions>
        <S.RoleBadge>{ROLE_LABELS[member.role]}</S.RoleBadge>
        {canManage && !member.isYou && (
          <S.DangerButton type="button" disabled={saving} onClick={() => onRemove(member)}>
            Remove
          </S.DangerButton>
        )}
      </S.RowActions>
    </S.Row>
  )
}

function InvitationRow({
  invitation,
  canManage,
  onResend,
  onRevoke,
}: {
  invitation: TeamInvitation
  canManage: boolean
  onResend: (id: string) => void
  onRevoke: (invitation: TeamInvitation) => void
}) {
  const saving = useTeamStore((s) => s.saving)
  const name = displayName(invitation)

  return (
    <S.Row>
      <S.Avatar>{initials(invitation.firstName, invitation.lastName, invitation.email)}</S.Avatar>
      <S.RowMain>
        <S.RowName>
          {name ?? invitation.email}
          <S.PendingTag>Invited</S.PendingTag>
        </S.RowName>
        <S.RowMeta>
          {invitation.email}
          {invitation.expiresAt && ` · expires ${formatTimestamp(invitation.expiresAt)}`}
          {invitation.invitedByName && ` · invited by ${invitation.invitedByName}`}
        </S.RowMeta>
      </S.RowMain>
      <S.RowActions>
        <S.RoleBadge>{ROLE_LABELS[invitation.role]}</S.RoleBadge>
        {canManage && (
          <>
            <S.GhostButton type="button" disabled={saving} onClick={() => onResend(invitation.id)}>
              Resend
            </S.GhostButton>
            <S.DangerButton type="button" disabled={saving} onClick={() => onRevoke(invitation)}>
              Revoke
            </S.DangerButton>
          </>
        )}
      </S.RowActions>
    </S.Row>
  )
}

// ── Page ────────────────────────────────────────────────────────

export default function TeamPage() {
  const client = useClientStore((s) => s.client)
  const team = useTeamStore((s) => s.team)
  const loading = useTeamStore((s) => s.loading)
  const error = useTeamStore((s) => s.error)
  const fetchTeam = useTeamStore((s) => s.fetchTeam)
  const resend = useTeamStore((s) => s.resend)
  const revoke = useTeamStore((s) => s.revoke)
  const clearError = useTeamStore((s) => s.clearError)

  const [inviteOpen, setInviteOpen] = useState(false)
  const [seatsOpen, setSeatsOpen] = useState(false)
  const [removing, setRemoving] = useState<TeamMember | null>(null)
  const [outcome, setOutcome] = useState<InviteOutcome | null>(null)
  const [notice, setNotice] = useState<{ message: string; ok: boolean } | null>(null)

  useEffect(() => {
    if (client) fetchTeam()
  }, [client, fetchTeam])

  async function handleResend(id: string) {
    setNotice(null)
    setOutcome(await resend(id))
  }

  async function handleRevoke(invitation: TeamInvitation) {
    const ok = await confirmDialog({
      title: 'Revoke this invitation?',
      message:
        `${invitation.email} will no longer be able to join, and their seat is freed ` +
        `immediately. You can invite them again later.`,
      confirmLabel: 'Revoke',
      danger: true,
    })
    if (!ok) return

    setOutcome(null)
    const done = await revoke(invitation.id)
    if (done) setNotice({ message: `Invitation to ${invitation.email} revoked.`, ok: true })
  }

  const seats = team?.seats
  const canManage = team?.canManage ?? false
  const seatsFull = seats != null && seats.remaining === 0
  const invitations = team?.invitations ?? []

  return (
    <S.PageRoot>
      <S.PageHead>
        <div>
          <S.PageTitle>Team</S.PageTitle>
          <S.PageSub>
            Everyone with access to this workspace. Each person — and each invitation waiting to
            be accepted — takes one seat on your plan.
          </S.PageSub>
        </div>
        {canManage && (
          <S.PrimaryButton
            type="button"
            onClick={() => {
              setOutcome(null)
              setNotice(null)
              if (seatsFull) setSeatsOpen(true)
              else setInviteOpen(true)
            }}
          >
            {seatsFull ? 'Request more seats' : 'Invite teammate'}
          </S.PrimaryButton>
        )}
      </S.PageHead>

      {error && <S.ResultLine $ok={false}>{error}</S.ResultLine>}
      {notice && <S.ResultLine $ok={notice.ok}>{notice.message}</S.ResultLine>}

      {outcome && (
        <>
          <S.ResultLine $ok={outcome.ok && outcome.emailSent}>{outcome.message}</S.ResultLine>
          {/* Shown whenever the email did not go out. The invitation is live
              and this link is the only way in, so it must not be buried. */}
          {outcome.acceptUrl && !outcome.emailSent && (
            <S.InviteLinkBox>
              <S.InviteLinkLabel>Accept link — send this to them directly</S.InviteLinkLabel>
              <S.InviteLink href={outcome.acceptUrl} target="_blank" rel="noreferrer">
                {outcome.acceptUrl}
              </S.InviteLink>
            </S.InviteLinkBox>
          )}
        </>
      )}

      {seats && (
        <S.Section>
          <S.SectionLabel>Seats</S.SectionLabel>
          <SeatMeter seats={seats} />
          {seatsFull && canManage && (
            <S.Hint>
              Every seat on your plan is taken. Revoke an invitation nobody has accepted, or ask
              the Veldt team for a larger plan — plan changes are made by Veldt, not from here.
            </S.Hint>
          )}
        </S.Section>
      )}

      <S.Section>
        <S.SectionLabel>Members</S.SectionLabel>
        <S.Card>
          {loading && !team ? (
            <S.EmptyState>Loading…</S.EmptyState>
          ) : team && team.members.length > 0 ? (
            team.members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                canManage={canManage}
                onRemove={(target) => {
                  setOutcome(null)
                  setNotice(null)
                  clearError()
                  setRemoving(target)
                }}
              />
            ))
          ) : (
            <S.EmptyState>Nobody here yet.</S.EmptyState>
          )}
        </S.Card>
      </S.Section>

      <OperatorBrandCard canEdit={canManage} />
      <OperatorContactCard canEdit={canManage} />

      {invitations.length > 0 && (
        <S.Section>
          <S.SectionLabel>Awaiting acceptance</S.SectionLabel>
          <S.Card>
            {invitations.map((invitation) => (
              <InvitationRow
                key={invitation.id}
                invitation={invitation}
                canManage={canManage}
                onResend={handleResend}
                onRevoke={handleRevoke}
              />
            ))}
          </S.Card>
          <S.Hint>
            These seats are held until the invitation is accepted, revoked, or expires.
          </S.Hint>
        </S.Section>
      )}

      {inviteOpen && (
        <InviteModal
          onClose={() => setInviteOpen(false)}
          onDone={(result) => {
            setInviteOpen(false)
            setOutcome(result)
          }}
        />
      )}

      {removing && team && (
        <RemoveMemberModal
          member={removing}
          members={team.members}
          onClose={() => setRemoving(null)}
          onDone={(message) => {
            setRemoving(null)
            setNotice({ message, ok: true })
          }}
        />
      )}

      {seatsOpen && (
        <RequestSeatsModal
          onClose={() => setSeatsOpen(false)}
          onDone={(message, sent) => {
            setSeatsOpen(false)
            setNotice({ message, ok: sent })
          }}
        />
      )}
    </S.PageRoot>
  )
}
