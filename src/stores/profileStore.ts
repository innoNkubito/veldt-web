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
  }
`

// ── Store ──────────────────────────────────────────────────────

interface ProfileState {
  profile: CurrentUser | null
  loading: boolean

  fetchProfile: () => Promise<void>
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,

  fetchProfile: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true })
    try {
      const data = await client.request<{ me: CurrentUser | null }>(ME)
      set({ profile: data.me, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  clearProfile: () => set({ profile: null }),
}))
