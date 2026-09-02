// Narrows an unknown value to a plain keyed object. Arrays are excluded:
// every caller wants a record, and `typeof [] === 'object'`.
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

// A <select> hands back a plain string. This maps it back onto the option
// union by finding it in the list, so an unrecognised value is `undefined`
// rather than a lie about the type.
export function parseOption<T extends string>(
  options: readonly T[],
  value: string,
): T | undefined {
  return options.find((option) => option === value)
}

// Object.keys widens to string[], losing the key union on an exhaustively
// typed record. The implementation signature stays loose deliberately —
// TypeScript cannot prove the narrowing structurally, and this states it
// once instead of at every call site.
export function keysOf<T extends object>(obj: T): (keyof T)[]
export function keysOf(obj: object): string[] {
  return Object.keys(obj)
}

// useParams() types every value as `string | string[]`, because a route
// segment can be a catch-all. These routes are all single-segment.
export function routeParam(value: string | string[] | undefined): string {
  if (typeof value === 'string') return value
  return value?.[0] ?? ''
}

// Builds a total record from an exhaustive key list, so the result is
// Record<K, V> by construction rather than an empty object asserted to be
// full. The implementation signature stays loose deliberately.
export function recordFrom<K extends string, V>(
  keys: readonly K[],
  value: (key: K) => V,
): Record<K, V>
export function recordFrom<V>(
  keys: readonly string[],
  value: (key: string) => V,
): Record<string, V> {
  const out: Record<string, V> = {}
  for (const key of keys) out[key] = value(key)
  return out
}

/** Returns the value when it is a string, otherwise undefined. */
export function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}
