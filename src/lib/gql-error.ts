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

import { isRecord } from './guards'

/** First GraphQL error message on the error, if there is one. */
function firstGraphQLMessage(err: unknown): string | null {
  if (!isRecord(err)) return null

  const response = err.response
  if (!isRecord(response)) return null

  const errors = response.errors
  if (!Array.isArray(errors) || errors.length === 0) return null

  const first = errors[0]
  if (!isRecord(first)) return null
  const message = first.message
  return typeof message === 'string' && message.trim() ? message : null
}

/**
 * The prefixes the API puts on messages written for the user to read.
 *
 * Anything without one was never meant to be shown: a resolver crash
 * ("Cannot read properties of undefined…"), a query the schema rejects, a
 * network failure, or a JS error thrown while handling the response. Those
 * fall back to the caller's message, which says what the user was doing.
 */
const USER_FACING = /^(VALIDATION|FORBIDDEN|NOT_FOUND|UNAUTHENTICATED|CONFIG|SEAT_LIMIT|OWNER_REQUIRED|SUBSCRIPTION_REQUIRED|PAYMENT):\s*/

/**
 * Resolves an error to a message for display.
 *
 * Shows the API's own message when it is one written for the user, with its
 * prefix stripped so the text reads naturally. Otherwise returns `fallback`,
 * which should name the operation that failed ("Could not save this flight")
 * — and logs the real error, so it is not lost.
 */
export function gqlErrorMessage(err: unknown, fallback: string): string {
  const message = firstGraphQLMessage(err)
  const match = message ? USER_FACING.exec(message) : null

  if (!message || !match) {
    console.error(`[gql] ${fallback}:`, message ?? err)
    return fallback
  }
  return message.slice(match[0].length).trim() || fallback
}
