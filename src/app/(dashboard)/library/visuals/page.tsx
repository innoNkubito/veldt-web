'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { useAuth } from '@clerk/nextjs'
import { useClientStore } from '@/stores/clientStore'
import { confirmDialog } from '@/stores/confirmStore'
import { uploadFile } from '@/lib/upload'
import {
  useMediaStore,
  validateImageFile,
  type MediaAsset,
} from '@/stores/mediaStore'
import * as S from './page.styled'

type SourceTab = 'ALL' | 'UPLOADED' | 'APP'

const SOURCE_TABS: { key: SourceTab; label: string }[] = [
  { key: 'ALL',      label: 'All' },
  { key: 'UPLOADED', label: 'Your Uploads' },
  { key: 'APP',      label: 'App Library' },
]

function formatSize(bytes: number | null): string {
  if (bytes == null) return ''
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Detail modal ────────────────────────────────────────────────

function AssetModal({ asset, onClose }: { asset: MediaAsset; onClose: () => void }) {
  const { updateAsset, deleteAsset } = useMediaStore()
  const [name, setName] = useState(asset.name)
  const [tags, setTags] = useState<string[]>(asset.tags)
  const [tagDraft, setTagDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const readOnly = asset.isAppProvided

  function addTag() {
    const t = tagDraft.trim().replace(/,+$/, '')
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagDraft('')
  }

  function handleTagKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !tagDraft && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1))
    }
  }

  async function handleSave() {
    if (readOnly) return
    setSaving(true)
    const result = await updateAsset(asset.id, { name: name.trim() || asset.name, tags })
    setSaving(false)
    if (result) onClose()
  }

  async function handleDelete() {
    const ok = await confirmDialog({
      title: 'Delete image?',
      message: `"${asset.name}" will be removed from your Visuals library. This cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!ok) return
    await deleteAsset(asset.id)
    onClose()
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(asset.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <S.Overlay onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <S.ModalCard>
        <S.ModalImage $url={asset.url} />
        <S.ModalBody>
          <S.ModalMeta>
            {asset.isAppProvided ? 'App-provided image' : 'Uploaded'}
            {asset.sizeBytes != null && ` · ${formatSize(asset.sizeBytes)}`}
            {' · '}
            {asset.contentType.replace('image/', '').toUpperCase()}
          </S.ModalMeta>

          <S.NameInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Image name"
            disabled={readOnly}
          />

          {!readOnly && (
            <S.TagsWrap>
              {tags.map((tag) => (
                <S.TagChip key={tag}>
                  {tag}
                  <S.TagRemove type="button" onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}>
                    ✕
                  </S.TagRemove>
                </S.TagChip>
              ))}
              <S.TagInput
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={handleTagKey}
                onBlur={addTag}
                placeholder={tags.length === 0 ? 'Add tags…' : ''}
              />
            </S.TagsWrap>
          )}

          {readOnly && asset.tags.length > 0 && (
            <S.CardTags>
              {asset.tags.map((tag) => <S.CardTag key={tag}>{tag}</S.CardTag>)}
            </S.CardTags>
          )}

          <S.ModalActions>
            <S.CopyButton onClick={handleCopy}>{copied ? 'Copied!' : 'Copy URL'}</S.CopyButton>
            {!readOnly && <S.DeleteLink onClick={handleDelete}>Delete</S.DeleteLink>}
            {!readOnly && (
              <S.SaveButton $disabled={saving} onClick={handleSave}>
                {saving ? 'Saving…' : 'Save'}
              </S.SaveButton>
            )}
          </S.ModalActions>
        </S.ModalBody>
      </S.ModalCard>
    </S.Overlay>
  )
}

// ── Page ────────────────────────────────────────────────────────

export default function VisualsPage() {
  const { getToken } = useAuth()
  const client = useClientStore((s) => s.client)
  const {
    assets, loading, uploading, error,
    fetchAssets, registerAsset, setUploading, setError,
  } = useMediaStore()

  const [sourceTab, setSourceTab] = useState<SourceTab>('ALL')
  const [search, setSearch] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [selected, setSelected] = useState<MediaAsset | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (client) fetchAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  const allTags = useMemo(
    () => [...new Set(assets.flatMap((a) => a.tags))].sort((a, b) => a.localeCompare(b)),
    [assets],
  )

  const counts = useMemo(() => ({
    ALL: assets.length,
    UPLOADED: assets.filter((a) => !a.isAppProvided).length,
    APP: assets.filter((a) => a.isAppProvided).length,
  }), [assets])

  const displayed = useMemo(() => {
    let list = assets
    if (sourceTab === 'UPLOADED') list = list.filter((a) => !a.isAppProvided)
    if (sourceTab === 'APP') list = list.filter((a) => a.isAppProvided)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (a) => a.name.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    if (activeTags.length > 0) {
      list = list.filter((a) => activeTags.every((t) => a.tags.includes(t)))
    }
    return list
  }, [assets, sourceTab, search, activeTags])

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const errors: string[] = []
    const valid: File[] = []
    for (const file of Array.from(files)) {
      const err = validateImageFile(file)
      if (err) errors.push(err)
      else valid.push(file)
    }
    setError(errors.length > 0 ? errors.join('\n') : null)
    if (valid.length === 0) return

    setUploading(true)
    try {
      for (const file of valid) {
        try {
          const url = await uploadFile(file, getToken)
          const baseName = file.name.replace(/\.[^.]+$/, '')
          await registerAsset({
            name: baseName,
            url,
            contentType: file.type.toLowerCase(),
            sizeBytes: file.size,
          })
        } catch {
          errors.push(`${file.name}: upload failed`)
          setError(errors.join('\n'))
        }
      }
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <Box sx={{ padding: '2rem' }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <S.PageHeaderRow>
        <div>
          <S.PageTitle>Visuals</S.PageTitle>
          <S.PageSubtitle>
            {counts.ALL} image{counts.ALL !== 1 ? 's' : ''} · {counts.UPLOADED} uploaded · {counts.APP} from the app library
          </S.PageSubtitle>
        </div>
        <S.HeaderControls>
          <S.SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or tag..."
          />
          <S.UploadButton $disabled={uploading} onClick={() => !uploading && fileRef.current?.click()}>
            {uploading ? 'Uploading…' : '↑ Upload'}
          </S.UploadButton>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/avif,image/webp,.jpg,.jpeg,.png,.avif,.webp"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </S.HeaderControls>
      </S.PageHeaderRow>

      {error && <S.ErrorBanner>{error}</S.ErrorBanner>}

      {/* ── Source tabs ────────────────────────────────────── */}
      <S.TabBar>
        {SOURCE_TABS.map(({ key, label }) => (
          <S.Tab key={key} $active={sourceTab === key} onClick={() => setSourceTab(key)}>
            {label}
            <S.TabCount $active={sourceTab === key}>{counts[key]}</S.TabCount>
          </S.Tab>
        ))}
      </S.TabBar>

      {/* ── Tag filters ────────────────────────────────────── */}
      {allTags.length > 0 && (
        <S.TagFilterRow>
          {allTags.map((tag) => (
            <S.TagFilterChip key={tag} $active={activeTags.includes(tag)} onClick={() => toggleTag(tag)}>
              {tag}
            </S.TagFilterChip>
          ))}
        </S.TagFilterRow>
      )}

      {/* ── Grid ───────────────────────────────────────────── */}
      {loading ? (
        <S.LoadingMessage>Loading visuals...</S.LoadingMessage>
      ) : displayed.length === 0 ? (
        <S.EmptyState>
          {assets.length === 0
            ? 'No images yet. Upload your first photos — JPG, PNG, AVIF or WEBP, up to 50MB each.'
            : 'No images match your filters.'}
        </S.EmptyState>
      ) : (
        <S.Grid>
          {displayed.map((asset) => (
            <S.CardWrap key={asset.id} onClick={() => setSelected(asset)}>
              <S.CardImage $url={asset.url}>
                {asset.isAppProvided && <S.AppBadge>App</S.AppBadge>}
              </S.CardImage>
              <S.CardBody>
                <S.CardName>{asset.name}</S.CardName>
                {asset.tags.length > 0 && (
                  <S.CardTags>
                    {asset.tags.slice(0, 3).map((tag) => <S.CardTag key={tag}>{tag}</S.CardTag>)}
                    {asset.tags.length > 3 && <S.CardTag>+{asset.tags.length - 3}</S.CardTag>}
                  </S.CardTags>
                )}
              </S.CardBody>
            </S.CardWrap>
          ))}
        </S.Grid>
      )}

      {/* ── Detail modal ───────────────────────────────────── */}
      {selected && <AssetModal asset={selected} onClose={() => setSelected(null)} />}
    </Box>
  )
}
