/** "Rwanda, primates ,rwanda" → ['rwanda', 'primates'] — the API normalises the same way. */
export function parseTags(value: string): string[] {
  return [...new Set(value.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean))]
}

export function formatTags(tags: string[]): string {
  return tags.join(', ')
}
