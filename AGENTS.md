<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Veldt Web — Coding Standards

## Project overview

Next.js App Router frontend for the Veldt Platform (safari itinerary builder for travel advisors).
All dashboard routes live under `src/app/(dashboard)/` and share a group-level shell layout.

## File & folder conventions

```
src/app/(dashboard)/<route>/
  page.tsx          ← thin; renders components/tabs only
  page.styled.ts    ← all Emotion styled components for this route
  tabs/             ← colocated tab components
  layout.tsx        ← passthrough only: return <>{children}</>

src/components/<Name>/
  <Name>.tsx
  <Name>.styled.ts
  index.ts

src/stores/<feature>Store.ts
src/lib/              ← gql-client, theme, upload, auth-token
```

## Styled components

Use `@emotion/styled`. Always import the whole file as `* as S`.

```ts
// page.styled.ts
import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
`
```

```tsx
// page.tsx
import * as S from './page.styled'
<S.PageRoot>…</S.PageRoot>
```

Never inline significant styles — put them in the `.styled.ts` file. No CSS modules.

## Design tokens — always use `T.*`

```ts
import { T } from '@/lib/theme'
```

| Token | Use |
|-------|-----|
| `T.terra` | Primary brand / CTA buttons |
| `T.terraLt` | Terra hover fill |
| `T.teal` | Action / info |
| `T.tealLt` | Teal hover fill |
| `T.gold` | Accent |
| `T.sage` | Success / nature |
| `T.bg` | Page background `#FAF6EF` |
| `T.card` | Card / surface `#FFFFFF` |
| `T.border` | Borders `#EDE6D6` |
| `T.text` | Primary text |
| `T.sub` | Secondary text |
| `T.muted` | Placeholders, meta |
| `T.dim` | Subtle background fills |

Fonts: `'DM Sans', sans-serif` for UI; `var(--font-playfair), 'Playfair Display', serif` for headings.

## Zustand stores

```ts
import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'

export const useExampleStore = create<State>((set) => ({
  items: [],
  loading: false,
  saving: false,

  fetchItems: async () => {
    const client = useClientStore.getState().client   // always getState() in actions
    if (!client) return
    set({ loading: true })
    try {
      const data = await client.request<{ items: Item[] }>(LIST_ITEMS)
      set({ items: data.items, loading: false })
    } catch (e: any) {
      set({ loading: false })
    }
  },
}))
```

Get the GQL client from `useClientStore.getState().client` inside actions — not in component hooks.

## GraphQL client

```ts
import { createGqlClient } from '@/lib/gql-client'
import { useAuth } from '@clerk/nextjs'

const { getToken } = useAuth()
const client = createGqlClient(getToken)  // sync, not async
```

Pass `getToken` (not a cached token string) so Clerk refreshes on every request.
Use `graphql-request` v7 with tagged `gql` strings.

## File uploads (S3)

```ts
import { uploadFile } from '@/lib/upload'
const url = await uploadFile(file, getToken)  // returns full public S3 URL
```

Flow: `getUploadUrl` mutation → presigned PUT URL → browser PUTs to S3 → returns `publicUrl`.

**Photo upload UI pattern** (consistent across Room modal and section editors):

```tsx
{photos.length > 0 && (
  <S.PhotoGrid>
    {photos.map((url, i) => (
      <S.PhotoThumb key={i} $url={url}>
        <S.PhotoRemove type="button" onClick={() => remove(i)}>✕</S.PhotoRemove>
      </S.PhotoThumb>
    ))}
  </S.PhotoGrid>
)}
<S.PhotoUploadZone htmlFor="photo-upload">
  <S.PhotoUploadBtn>{uploading ? 'Uploading…' : 'Add Photos'}</S.PhotoUploadBtn>
  <S.PhotoUploadNote>Click here to upload photos.</S.PhotoUploadNote>
  <S.PhotoUploadNote>File formats include JPG, PNG, WEBP. Max 5 MB each.</S.PhotoUploadNote>
</S.PhotoUploadZone>
<input id="photo-upload" type="file" accept="image/*" multiple
  style={{ display: 'none' }} ref={fileRef} onChange={handleUpload} />
```

## Layout

`src/app/(dashboard)/layout.tsx` is the permanent shell (TopNav + Sidebar + Main).
Sub-route `layout.tsx` files must be passthrough only.
`PageRoot` in each `page.styled.ts` owns its own `padding: 2rem`; the shell's `Main` has none.

## Property detail — tab order & patterns

Tabs: **Details → Rooms → New Page**

- **Details**: `FieldInput`/`FieldLabel`/`FieldGroup` grid; auto-save via `updateProperty`
- **Rooms**: add/edit via `RoomModal` overlay — room type (required), description, photos (multi-upload), video links
- **New Page** (`PageContentTab`): two-column layout — sticky blurred cover panel (left, always visible) + sections editor/view (right)

## pageContent JSON schema (PROPERTY)

```ts
{ type: 'overview' | 'experience', text1: string, images: string[], text2: string }
{ type: 'accommodation', intro: string }   // rooms rendered live from property.rooms
{ type: 'fastFacts', groups: [{ label: string, items: string[] }] }
```

Default template order: overview → experience → accommodation → fastFacts.

## Rules

- TypeScript strict — type all store state and GQL responses; no `any` unless unavoidable
- No mock or hardcoded data in any dashboard route
- After every change: `npx tsc --noEmit` must produce no output
