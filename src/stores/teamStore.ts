import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'

/**
 * The operator's own team.
 *
 * Seats are the whole point of this store: a seat is spent the moment an
 * invitation is sent, not when it is accepted, so `seats.used` here counts
 * pending invitations as well as members. The owner therefore finds out they
 * are full before a colleague is left with a sign-in and no workspace.
 */

export type UserRole = 'OWNER' | 'ADVISOR' | 'VIEWER'
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED'

export interface SeatUsage {
  used: number
  members: number
  pending: number
  limit: number | null
  remaining: number | null
}

export interface TeamMember {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  role: UserRole
  joinedAt: string
  isYou: boolean
}

export interface TeamInvitation {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: UserRole
  status: InvitationStatus
  acceptUrl: string | null
  failureReason: string | null
  invitedByName: string | null
  expiresAt: string | null
  createdAt: string
}

export interface Team {
  seats: SeatUsage
  members: TeamMember[]
  invitations: TeamInvitation[]
  canManage: boolean
}

export interface InviteInput {
  email: string
  firstName?: string
  lastName?: string
  role: UserRole
}

export const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: 'Owner',
  ADVISOR: 'Advisor',
  VIEWER: 'Viewer',
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  OWNER: 'Full access, including billing and the team.',
  ADVISOR: 'Builds and manages itineraries.',
  VIEWER: 'Read-only access.',
}

/** Roles an owner may hand out. Owner included — succession needs it. */
export const ASSIGNABLE_ROLES: UserRole[] = ['ADVISOR', 'VIEWER', 'OWNER']

const INVITATION_FIELDS = `
  id
  email
  firstName
  lastName
  role
  status
  acceptUrl
  failureReason
  invitedByName
  expiresAt
  createdAt
`

/** How travellers reach the operator; null fields are not set. */
export interface OperatorContact {
  name: string
  phone: string | null
  whatsapp: string | null
  email: string | null
}

export interface OperatorContactInput {
  phone: string | null
  whatsapp: string | null
  email: string | null
}

const OPERATOR_CONTACT = gql`
  query OperatorContact {
    operatorContact { name phone whatsapp email }
  }
`

const UPDATE_OPERATOR_CONTACT = gql`
  mutation UpdateOperatorContact($input: OperatorContactInput!) {
    updateOperatorContact(input: $input) { name phone whatsapp email }
  }
`

const TEAM = gql`
  query Team {
    team {
      canManage
      seats { used members pending limit remaining }
      members { id firstName lastName email role joinedAt isYou }
      invitations { ${INVITATION_FIELDS} }
    }
  }
`

const INVITE_TEAM_MEMBER = gql`
  mutation InviteTeamMember($input: InviteTeamMemberInput!) {
    inviteTeamMember(input: $input) {
      emailSent
      invitation { ${INVITATION_FIELDS} }
    }
  }
`

const RESEND_TEAM_INVITATION = gql`
  mutation ResendTeamInvitation($id: ID!) {
    resendTeamInvitation(id: $id) {
      emailSent
      invitation { ${INVITATION_FIELDS} }
    }
  }
`

const REVOKE_TEAM_INVITATION = gql`
  mutation RevokeTeamInvitation($id: ID!) {
    revokeTeamInvitation(id: $id) { id }
  }
`

const REQUEST_ADDITIONAL_SEATS = gql`
  mutation RequestAdditionalSeats($input: RequestSeatsInput!) {
    requestAdditionalSeats(input: $input) {
      sent
      message
    }
  }
`

const REMOVE_TEAM_MEMBER = gql`
  mutation RemoveTeamMember($input: RemoveTeamMemberInput!) {
    removeTeamMember(input: $input) { itineraries aboutUsPages tasks }
  }
`

/** What moved to the colleague who took over a removed member's work. */
export interface RemovalHandover {
  itineraries: number
  aboutUsPages: number
  tasks: number
}

/** What the page shows after an invite or resend — the link matters most. */
export interface InviteOutcome {
  ok: boolean
  message: string
  acceptUrl: string | null
  emailSent: boolean
}

interface State {
  team: Team | null
  loading: boolean
  saving: boolean
  error: string | null

  fetchTeam: () => Promise<void>
  invite: (input: InviteInput) => Promise<InviteOutcome>
  resend: (id: string) => Promise<InviteOutcome>
  revoke: (id: string) => Promise<boolean>
  requestSeats: (
    additionalSeats: number,
    note?: string,
  ) => Promise<{ sent: boolean; message: string }>
  /** Returns what was handed over, or null on failure (message in `error`). */
  removeMember: (memberId: string, reassignToId: string) => Promise<RemovalHandover | null>
  clearError: () => void

  operatorContact: OperatorContact | null
  fetchOperatorContact: () => Promise<void>
  /** Returns an error message, or null once saved. */
  updateOperatorContact: (input: OperatorContactInput) => Promise<string | null>
}

export const useTeamStore = create<State>((set, get) => ({
  team: null,
  loading: false,
  saving: false,
  error: null,

  clearError: () => set({ error: null }),

  operatorContact: null,

  fetchOperatorContact: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      const data = await client.request<{ operatorContact: OperatorContact | null }>(OPERATOR_CONTACT)
      set({ operatorContact: data.operatorContact })
    } catch (err) {
      set({ error: gqlErrorMessage(err, 'Could not load your contact details.') })
    }
  },

  updateOperatorContact: async (input) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true })
    try {
      const data = await client.request<{ updateOperatorContact: OperatorContact | null }>(
        UPDATE_OPERATOR_CONTACT,
        { input },
      )
      set({ operatorContact: data.updateOperatorContact, saving: false })
      return null
    } catch (err) {
      set({ saving: false })
      return gqlErrorMessage(err, 'Could not save your contact details.')
    }
  },

  fetchTeam: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ team: Team }>(TEAM)
      set({ team: data.team, loading: false })
    } catch (err) {
      set({ loading: false, error: gqlErrorMessage(err, 'Could not load your team.') })
    }
  },

  invite: async (input) => {
    const client = useClientStore.getState().client
    if (!client) return { ok: false, message: 'Not connected.', acceptUrl: null, emailSent: false }

    set({ saving: true, error: null })
    try {
      const data = await client.request<{
        inviteTeamMember: { emailSent: boolean; invitation: TeamInvitation }
      }>(INVITE_TEAM_MEMBER, { input })
      set({ saving: false })
      // Seat counts changed server-side; re-read rather than patch locally.
      await get().fetchTeam()

      const { emailSent, invitation } = data.inviteTeamMember
      return {
        ok: true,
        message: emailSent
          ? `Invitation sent to ${invitation.email}.`
          : `${invitation.email} is invited, but the email could not be delivered. ` +
            `Send them the link below.`,
        acceptUrl: invitation.acceptUrl,
        emailSent,
      }
    } catch (err) {
      const message = gqlErrorMessage(err, 'Could not send that invitation.')
      set({ saving: false, error: message })
      return { ok: false, message, acceptUrl: null, emailSent: false }
    }
  },

  resend: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return { ok: false, message: 'Not connected.', acceptUrl: null, emailSent: false }

    set({ saving: true, error: null })
    try {
      const data = await client.request<{
        resendTeamInvitation: { emailSent: boolean; invitation: TeamInvitation }
      }>(RESEND_TEAM_INVITATION, { id })
      set({ saving: false })
      await get().fetchTeam()

      const { emailSent, invitation } = data.resendTeamInvitation
      return {
        ok: true,
        message: emailSent
          ? `Invitation re-sent to ${invitation.email}.`
          : `Invitation renewed, but the email could not be delivered. Send the link below.`,
        acceptUrl: invitation.acceptUrl,
        emailSent,
      }
    } catch (err) {
      const message = gqlErrorMessage(err, 'Could not re-send that invitation.')
      set({ saving: false, error: message })
      return { ok: false, message, acceptUrl: null, emailSent: false }
    }
  },

  revoke: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return false

    set({ saving: true, error: null })
    try {
      await client.request(REVOKE_TEAM_INVITATION, { id })
      set({ saving: false })
      await get().fetchTeam()
      return true
    } catch (err) {
      set({ saving: false, error: gqlErrorMessage(err, 'Could not revoke that invitation.') })
      return false
    }
  },

  removeMember: async (memberId, reassignToId) => {
    const client = useClientStore.getState().client
    if (!client) return null

    set({ saving: true, error: null })
    try {
      const data = await client.request<{ removeTeamMember: RemovalHandover }>(
        REMOVE_TEAM_MEMBER,
        { input: { memberId, reassignToId } },
      )
      set({ saving: false })
      await get().fetchTeam()
      return data.removeTeamMember
    } catch (err) {
      set({ saving: false, error: gqlErrorMessage(err, 'Could not remove that member.') })
      return null
    }
  },

  requestSeats: async (additionalSeats, note) => {
    const client = useClientStore.getState().client
    if (!client) return { sent: false, message: 'Not connected.' }

    set({ saving: true, error: null })
    try {
      const data = await client.request<{
        requestAdditionalSeats: { sent: boolean; message: string }
      }>(REQUEST_ADDITIONAL_SEATS, { input: { additionalSeats, note } })
      set({ saving: false })
      return data.requestAdditionalSeats
    } catch (err) {
      const message = gqlErrorMessage(err, 'Could not send that request.')
      set({ saving: false, error: message })
      return { sent: false, message }
    }
  },
}))
