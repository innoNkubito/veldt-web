import { gql } from 'graphql-request'
import { createGqlClient } from '@/lib/gql-client'

const GET_UPLOAD_URL = gql`
  mutation GetUploadUrl($filename: String!, $contentType: String!) {
    getUploadUrl(filename: $filename, contentType: $contentType) {
      uploadUrl
      publicUrl
    }
  }
`

interface GetUploadUrlResult {
  getUploadUrl: { uploadUrl: string; publicUrl: string }
}

/**
 * Upload a file to S3 via a presigned URL.
 *
 * Flow:
 *   1. Ask the API for a presigned PUT URL + the permanent public URL.
 *   2. PUT the file directly to S3 (no API involvement with bytes).
 *   3. Return the public URL to store in the database.
 *
 * @param file     - File object from an <input type="file"> or drag-drop
 * @param getToken - Clerk `useAuth().getToken` bound by the caller
 * @returns        - Permanent public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  getToken: () => Promise<string | null>,
): Promise<string> {
  const client = createGqlClient(getToken)

  const { getUploadUrl } = await client.request<GetUploadUrlResult>(
    GET_UPLOAD_URL,
    { filename: file.name, contentType: file.type || 'application/octet-stream' },
  )

  const res = await fetch(getUploadUrl.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  })

  if (!res.ok) {
    throw new Error(`S3 upload failed: ${res.status} ${res.statusText}`)
  }

  return getUploadUrl.publicUrl
}
