/**
 * Extracts a human-readable message from a graphql-request error.
 *
 * Takes `unknown` — the type TypeScript gives a caught value under `strict` —
 * and narrows it by inspection, so no `any` or assertion is needed at the
 * ~80 call sites across the stores.
 *
 * graphql-request throws a ClientError shaped roughly:
 *   { response: { errors: [{ message: string }] }, message: string }
 */

interface GraphQLErrorEntry {
  message?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/** First GraphQL error message on the error, if there is one. */
function firstGraphQLMessage(err: unknown): string | null {
  if (!isRecord(err)) return null

  const response = err.response
  if (!isRecord(response)) return null

  const errors = response.errors
  if (!Array.isArray(errors) || errors.length === 0) return null

  const message = (errors[0] as GraphQLErrorEntry)?.message
  return typeof message === 'string' && message.trim() ? message : null
}

/**
 * Resolves an error to a message for display.
 * Server-side error prefixes (VALIDATION:, FORBIDDEN:, NOT_FOUND:) are stripped
 * so the text reads naturally in the UI.
 */
export function gqlErrorMessage(err: unknown, fallback: string): string {
  const message =
    firstGraphQLMessage(err) ??
    (isRecord(err) && typeof err.message === 'string' ? err.message : null)

  if (!message) return fallback
  return message.replace(/^(VALIDATION|FORBIDDEN|NOT_FOUND|UNAUTHENTICATED|CONFIG): /, '')
}
