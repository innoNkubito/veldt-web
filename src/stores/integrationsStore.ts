import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'

// ── Types ───────────────────────────────────────────────────────

export type PaymentProcessorType = 'DPO'
export type ProcessorStatus = 'PENDING' | 'ACTIVE' | 'DISABLED'
export type ProcessorEnvironment = 'TEST' | 'LIVE'

export interface ProcessorConnection {
  id: string
  type: PaymentProcessorType
  label: string
  status: ProcessorStatus
  environment: ProcessorEnvironment
  supportsCards: boolean
  supportsAch: boolean
  createdAt: string
  updatedAt: string
}

export interface CredentialField {
  key: string
  label: string
  placeholder?: string
  /** Masked on entry and never displayed again */
  secret?: boolean
  hint?: string
}

// Metadata for each supported processor — drives the connect form.
export const PROCESSOR_META: Record<
  PaymentProcessorType,
  {
    name: string
    description: string
    credentialFields: CredentialField[]
    defaultSupportsAch: boolean
    /** Shown under the environment toggle when TEST is selected */
    sandboxHint?: string
  }
> = {
  DPO: {
    name: 'DPO Pay',
    description: 'Card, mobile money and bank payments across Africa.',
    credentialFields: [
      {
        key: 'companyToken',
        label: 'Company Token',
        placeholder: 'e.g. B3F59BE7-0756-420E-BB88-1D98E7A6B040',
        secret: true,
      },
      {
        key: 'serviceType',
        label: 'Service Type ID',
        placeholder: 'e.g. 54841',
        hint: 'The service/product ID issued with your DPO account.',
      },
    ],
    defaultSupportsAch: false,
    sandboxHint:
      'DPO uses the same API endpoint for sandbox and live — only the credentials differ. Use the published test company tokens here.',
  },
}

// ── GQL ─────────────────────────────────────────────────────────

const CONNECTION_FIELDS = `
  id type label status environment supportsCards supportsAch createdAt updatedAt
`

const GET_CONNECTIONS = gql`
  query GetProcessorConnections {
    processorConnections { ${CONNECTION_FIELDS} }
  }
`

const CREATE_CONNECTION = gql`
  mutation CreateProcessorConnection($input: CreateProcessorConnectionInput!) {
    createProcessorConnection(input: $input) { ${CONNECTION_FIELDS} }
  }
`

const UPDATE_CONNECTION = gql`
  mutation UpdateProcessorConnection($id: ID!, $input: UpdateProcessorConnectionInput!) {
    updateProcessorConnection(id: $id, input: $input) { ${CONNECTION_FIELDS} }
  }
`

const DELETE_CONNECTION = gql`
  mutation DeleteProcessorConnection($id: ID!) {
    deleteProcessorConnection(id: $id)
  }
`

// ── Store ───────────────────────────────────────────────────────

interface IntegrationsState {
  connections: ProcessorConnection[]
  loading: boolean
  saving: boolean
  error: string | null

  fetchConnections: () => Promise<void>
  createConnection: (input: {
    type: PaymentProcessorType
    label: string
    environment: ProcessorEnvironment
    credentials: Record<string, string>
    supportsCards?: boolean
    supportsAch?: boolean
  }) => Promise<ProcessorConnection | null>
  updateConnection: (
    id: string,
    input: {
      label?: string
      status?: ProcessorStatus
      environment?: ProcessorEnvironment
      credentials?: Record<string, string>
      supportsCards?: boolean
      supportsAch?: boolean
    },
  ) => Promise<ProcessorConnection | null>
  deleteConnection: (id: string) => Promise<void>
  setError: (error: string | null) => void
}

export const useIntegrationsStore = create<IntegrationsState>((set) => ({
  connections: [],
  loading: false,
  saving: false,
  error: null,

  fetchConnections: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ processorConnections: ProcessorConnection[] }>(
        GET_CONNECTIONS,
      )
      set({ connections: data.processorConnections, loading: false })
    } catch (err: any) {
      set({
        error: err?.response?.errors?.[0]?.message ?? 'Failed to load integrations',
        loading: false,
      })
    }
  },

  createConnection: async (input) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true, error: null })
    try {
      const data = await client.request<{ createProcessorConnection: ProcessorConnection }>(
        CREATE_CONNECTION,
        { input },
      )
      set((s) => ({
        connections: [data.createProcessorConnection, ...s.connections],
        saving: false,
      }))
      return data.createProcessorConnection
    } catch (err: any) {
      set({
        error: err?.response?.errors?.[0]?.message ?? 'Failed to connect processor',
        saving: false,
      })
      return null
    }
  },

  updateConnection: async (id, input) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true, error: null })
    try {
      const data = await client.request<{ updateProcessorConnection: ProcessorConnection }>(
        UPDATE_CONNECTION,
        { id, input },
      )
      set((s) => ({
        connections: s.connections.map((c) => (c.id === id ? data.updateProcessorConnection : c)),
        saving: false,
      }))
      return data.updateProcessorConnection
    } catch (err: any) {
      set({
        error: err?.response?.errors?.[0]?.message ?? 'Failed to update connection',
        saving: false,
      })
      return null
    }
  },

  deleteConnection: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ error: null })
    try {
      await client.request(DELETE_CONNECTION, { id })
      set((s) => ({ connections: s.connections.filter((c) => c.id !== id) }))
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to remove connection' })
    }
  },

  setError: (error) => set({ error }),
}))
