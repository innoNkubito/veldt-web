import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'
import { putFile } from '@/lib/upload'

/**
 * The operator's brand — the watermark on every client-facing itinerary.
 * The owner sets the logo once; the name and any later logo change are Veldt's
 * (admin actions below).
 */

export interface OperatorBrand {
  name: string
  logoUrl: string | null
  logoLocked: boolean
}

export interface OperatorBrandInput {
  name: string
  /** Null removes the logo. */
  logoUrl: string | null
}

const BRAND_FIELDS = 'name logoUrl logoLocked'

const OPERATOR_BRAND = gql`
  query OperatorBrand { operatorBrand { ${BRAND_FIELDS} } }
`
const ADMIN_OPERATOR_BRAND = gql`
  query AdminOperatorBrand($operatorId: ID!) { adminOperatorBrand(operatorId: $operatorId) { ${BRAND_FIELDS} } }
`
const GET_LOGO_UPLOAD_URL = gql`
  mutation GetLogoUploadUrl($filename: String!, $contentType: String!, $operatorId: ID) {
    getLogoUploadUrl(filename: $filename, contentType: $contentType, operatorId: $operatorId) {
      uploadUrl
      publicUrl
    }
  }
`
const SET_OPERATOR_LOGO = gql`
  mutation SetOperatorLogo($logoUrl: String!) { setOperatorLogo(logoUrl: $logoUrl) { ${BRAND_FIELDS} } }
`
const UPDATE_OPERATOR_BRAND = gql`
  mutation UpdateOperatorBrand($operatorId: ID!, $input: OperatorBrandInput!) {
    updateOperatorBrand(operatorId: $operatorId, input: $input) { ${BRAND_FIELDS} }
  }
`

interface State {
  brand: OperatorBrand | null
  saving: boolean
  fetchBrand: () => Promise<void>
  /** Uploads and sets the owner's logo; returns an error message or null. */
  setLogo: (file: File) => Promise<string | null>

  // ── Platform admin ──
  fetchAdminBrand: (operatorId: string) => Promise<OperatorBrand | null>
  /** Uploads a logo for another operator; returns its URL. Throws on failure. */
  uploadAdminLogo: (operatorId: string, file: File) => Promise<string>
  updateAdminBrand: (operatorId: string, input: OperatorBrandInput) => Promise<string | null>
}

async function uploadLogo(file: File, operatorId: string | null): Promise<string> {
  const client = useClientStore.getState().client
  if (!client) throw new Error('Not connected')
  const data = await client.request<{ getLogoUploadUrl: { uploadUrl: string; publicUrl: string } }>(
    GET_LOGO_UPLOAD_URL,
    { filename: file.name, contentType: file.type, operatorId },
  )
  await putFile(data.getLogoUploadUrl.uploadUrl, file)
  return data.getLogoUploadUrl.publicUrl
}

export const useBrandStore = create<State>((set) => ({
  brand: null,
  saving: false,

  fetchBrand: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      const data = await client.request<{ operatorBrand: OperatorBrand }>(OPERATOR_BRAND)
      set({ brand: data.operatorBrand })
    } catch (err) {
      console.error(err)
    }
  },

  setLogo: async (file) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ saving: true })
    try {
      const logoUrl = await uploadLogo(file, null)
      const data = await client.request<{ setOperatorLogo: OperatorBrand }>(SET_OPERATOR_LOGO, { logoUrl })
      set({ brand: data.setOperatorLogo, saving: false })
      return null
    } catch (err) {
      set({ saving: false })
      return gqlErrorMessage(err, 'Could not upload your logo.')
    }
  },

  fetchAdminBrand: async (operatorId) => {
    const client = useClientStore.getState().client
    if (!client) return null
    try {
      const data = await client.request<{ adminOperatorBrand: OperatorBrand }>(ADMIN_OPERATOR_BRAND, {
        operatorId,
      })
      return data.adminOperatorBrand
    } catch (err) {
      console.error(err)
      return null
    }
  },

  uploadAdminLogo: (operatorId, file) => uploadLogo(file, operatorId),

  updateAdminBrand: async (operatorId, input) => {
    const client = useClientStore.getState().client
    if (!client) return 'Not connected'
    set({ saving: true })
    try {
      await client.request(UPDATE_OPERATOR_BRAND, { operatorId, input })
      set({ saving: false })
      return null
    } catch (err) {
      set({ saving: false })
      return gqlErrorMessage(err, 'Could not save the brand.')
    }
  },
}))
