import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'

// ── Types ──────────────────────────────────────────────────────

export interface OperatorProfile {
  id: string
  name: string
  slug: string
}

export interface CurrentUser {
  id: string
  firstName: string | null
  lastName: string | null
  role: string
  operator: OperatorProfile
}

// ── GQL ────────────────────────────────────────────────────────

const ME = gql`
  query Me {
    me {
      id
      firstName
      lastName
      role
      operator {
        id
        name
        slug
      }
    }
    isPlatformAdmin
  }
`

// ── Store ──────────────────────────────────────────────────────

/**
 * Resolution of the signed-in user against a Veldt workspace.
 *
 * `me` returns null rather than erroring when the Clerk account has no
 * OperatorUser row, so a null profile alone cannot tell "still loading" from
 * "this account belongs to no workspace" — which is why that state used to
 * render as an ordinary empty dashboard. This makes the difference explicit.
 *
 *   loading      — the answer is not in yet
 *   ready        — the user belongs to an operator
 *   staff        — no operator, but Veldt staff; the admin screens still apply
 *   no-workspace — no operator and not staff; a dead end only support can fix
 *   error        — the request itself failed; retryable, unlike no-workspace
 */
export type ProfileStatus = 'idle' | 'loading' | 'ready' | 'staff' | 'no-workspace' | 'error'

interface ProfileState {
  profile: CurrentUser | null
  isPlatformAdmin: boolean
  status: ProfileStatus
  loading: boolean

  fetchProfile: () => Promise<void>
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isPlatformAdmin: false,
  status: 'idle',
  loading: false,

  fetchProfile: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, status: 'loading' })
    try {
      const data = await client.request<{
        me: CurrentUser | null
        isPlatformAdmin: boolean
      }>(ME)
      set({
        profile: data.me,
        isPlatformAdmin: data.isPlatformAdmin,
        loading: false,
        status: data.me ? 'ready' : data.isPlatformAdmin ? 'staff' : 'no-workspace',
      })
    } catch {
      // Distinct from no-workspace: the server never answered, so this is
      // worth retrying rather than sending the user to support.
      set({ loading: false, status: 'error' })
    }
  },

  clearProfile: () =>
    set({ profile: null, isPlatformAdmin: false, status: 'idle' }),
}))
