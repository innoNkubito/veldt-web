import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'

// ── Types ───────────────────────────────────────────────────────

export interface MediaAsset {
  id: string
  name: string
  tags: string[]
  url: string
  contentType: string
  sizeBytes: number | null
  isAppProvided: boolean
  uploadedBy: { id: string; firstName: string | null; lastName: string | null } | null
  createdAt: string
}

export const MAX_IMAGE_BYTES = 50 * 1024 * 1024 // 50 MB

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'JPG',
  'image/jpg': 'JPG',
  'image/png': 'PNG',
  'image/avif': 'AVIF',
  'image/webp': 'WEBP',
}

/** Returns an error message, or null when the file is acceptable. */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES[file.type?.toLowerCase() ?? '']) {
    return `${file.name}: only JPG, PNG, AVIF and WEBP images are allowed`
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `${file.name}: exceeds the 50MB limit`
  }
  return null
}

// ── GQL ─────────────────────────────────────────────────────────

const MEDIA_FIELDS = `
  id name tags url contentType sizeBytes isAppProvided
  uploadedBy { id firstName lastName }
  createdAt
`

const GET_MEDIA_ASSETS = gql`
  query GetMediaAssets {
    mediaAssets { ${MEDIA_FIELDS} }
  }
`

const CREATE_MEDIA_ASSET = gql`
  mutation CreateMediaAsset($input: CreateMediaAssetInput!) {
    createMediaAsset(input: $input) { ${MEDIA_FIELDS} }
  }
`

const UPDATE_MEDIA_ASSET = gql`
  mutation UpdateMediaAsset($id: ID!, $input: UpdateMediaAssetInput!) {
    updateMediaAsset(id: $id, input: $input) { ${MEDIA_FIELDS} }
  }
`

const DELETE_MEDIA_ASSET = gql`
  mutation DeleteMediaAsset($id: ID!) {
    deleteMediaAsset(id: $id)
  }
`

// ── Store ───────────────────────────────────────────────────────

interface MediaState {
  assets: MediaAsset[]
  loading: boolean
  uploading: boolean
  error: string | null

  fetchAssets: () => Promise<void>
  registerAsset: (input: {
    name: string
    url: string
    contentType: string
    sizeBytes?: number
    tags?: string[]
  }) => Promise<MediaAsset | null>
  updateAsset: (id: string, input: { name?: string; tags?: string[] }) => Promise<MediaAsset | null>
  deleteAsset: (id: string) => Promise<void>
  setUploading: (uploading: boolean) => void
  setError: (error: string | null) => void
}

export const useMediaStore = create<MediaState>((set) => ({
  assets: [],
  loading: false,
  uploading: false,
  error: null,

  fetchAssets: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ mediaAssets: MediaAsset[] }>(GET_MEDIA_ASSETS)
      set({ assets: data.mediaAssets, loading: false })
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to load visuals', loading: false })
    }
  },

  registerAsset: async (input) => {
    const client = useClientStore.getState().client
    if (!client) return null
    try {
      const data = await client.request<{ createMediaAsset: MediaAsset }>(CREATE_MEDIA_ASSET, {
        input,
      })
      set((s) => ({ assets: [data.createMediaAsset, ...s.assets] }))
      return data.createMediaAsset
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to save image' })
      return null
    }
  },

  updateAsset: async (id, input) => {
    const client = useClientStore.getState().client
    if (!client) return null
    try {
      const data = await client.request<{ updateMediaAsset: MediaAsset }>(UPDATE_MEDIA_ASSET, {
        id,
        input,
      })
      set((s) => ({ assets: s.assets.map((a) => (a.id === id ? data.updateMediaAsset : a)) }))
      return data.updateMediaAsset
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to update image' })
      return null
    }
  },

  deleteAsset: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      await client.request(DELETE_MEDIA_ASSET, { id })
      set((s) => ({ assets: s.assets.filter((a) => a.id !== id) }))
    } catch (err: any) {
      set({ error: err?.response?.errors?.[0]?.message ?? 'Failed to delete image' })
    }
  },

  setUploading: (uploading) => set({ uploading }),
  setError: (error) => set({ error }),
}))
