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

// ── Upload modal ────────────────────────────────────────────────

const ACCEPTED_EXTENSIONS = ['JPG', 'JPEG', 'PNG', 'AVIF', 'WEBP']
const ACCEPT_ATTR = 'image/jpeg,image/png,image/avif,image/webp,.jpg,.jpeg,.png,.avif,.webp'

interface UploadEntry {
  file: File
  name: string
  preview: string
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const { getToken } = useAuth()
  const { registerAsset } = useMediaStore()
  const [entries, setEntries] = useState<UploadEntry[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      entries.forEach((e) => URL.revokeObjectURL(e.preview))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const errs: string[] = []
    const added: UploadEntry[] = []
    for (const file of Array.from(files)) {
      const err = validateImageFile(file)
      if (err) {
        errs.push(err)
      } else {
        added.push({
          file,
          name: file.name.replace(/\.[^.]+$/, ''),
          preview: URL.createObjectURL(file),
        })
      }
    }
    setErrors(errs)
    if (added.length > 0) setEntries((prev) => [...prev, ...added])
    if (fileRef.current) fileRef.current.value = ''
  }

  function removeEntry(index: number) {
    setEntries((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  function renameEntry(index: number, name: string) {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, name } : e)))
  }

  async function handleUpload() {
    if (entries.length === 0 || uploading) return
    setUploading(true)
    const errs: string[] = []
    const failed: UploadEntry[] = []
    for (const entry of entries) {
      try {
        const url = await uploadFile(entry.file, getToken)
        const fallback = entry.file.name.replace(/\.[^.]+$/, '')
        const asset = await registerAsset({
          name: entry.name.trim() || fallback,
          url,
          contentType: entry.file.type.toLowerCase(),
          sizeBytes: entry.file.size,
        })
        if (!asset) {
          errs.push(`${entry.file.name}: failed to save`)
          failed.push(entry)
        } else {
          URL.revokeObjectURL(entry.preview)
        }
      } catch {
        errs.push(`${entry.file.name}: upload failed`)
        failed.push(entry)
      }
    }
    setUploading(false)
    if (errs.length > 0) {
      setErrors(errs)
      setEntries(failed)
    } else {
      onClose()
    }
  }

  return (
    <S.Overlay onMouseDown={(e) => { if (e.target === e.currentTarget && !uploading) onClose() }}>
      <S.UploadModalCard>
        <S.UploadModalTitle>Upload Media</S.UploadModalTitle>

        {errors.length > 0 && <S.ErrorBanner>{errors.join('\n')}</S.ErrorBanner>}

        <S.UploadZone
          $dragOver={dragOver}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
        >
          <S.UploadZoneTitle>Click here or drag images to upload</S.UploadZoneTitle>
          <S.UploadZoneNote>Accepted formats: {ACCEPTED_EXTENSIONS.join(', ')}</S.UploadZoneNote>
          <S.UploadZoneNote>Max 50 MB per image</S.UploadZoneNote>
        </S.UploadZone>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          style={{ display: 'none' }}
          onChange={(e) => addFiles(e.target.files)}
        />

        {entries.length > 0 && (
          <S.UploadFileList>
            {entries.map((entry, i) => (
              <S.UploadFileRow key={`${entry.file.name}-${i}`}>
                <S.UploadFileThumb $url={entry.preview} />
                <S.NameInput
                  value={entry.name}
                  onChange={(e) => renameEntry(i, e.target.value)}
                  placeholder="Image name"
                  disabled={uploading}
                />
                <S.UploadFileMeta>{formatSize(entry.file.size)}</S.UploadFileMeta>
                <S.UploadFileRemove type="button" disabled={uploading} onClick={() => removeEntry(i)}>
                  ✕
                </S.UploadFileRemove>
              </S.UploadFileRow>
            ))}
          </S.UploadFileList>
        )}

        <S.ModalActions>
          <S.CopyButton type="button" onClick={() => !uploading && onClose()}>Cancel</S.CopyButton>
          <S.SaveButton
            $disabled={uploading || entries.length === 0}
            onClick={handleUpload}
          >
            {uploading
              ? 'Uploading…'
              : `Upload${entries.length > 0 ? ` ${entries.length} image${entries.length !== 1 ? 's' : ''}` : ''}`}
          </S.SaveButton>
        </S.ModalActions>
      </S.UploadModalCard>
    </S.Overlay>
  )
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
  const client = useClientStore((s) => s.client)
  const { assets, loading, error, fetchAssets } = useMediaStore()

  const [sourceTab, setSourceTab] = useState<SourceTab>('ALL')
  const [search, setSearch] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [selected, setSelected] = useState<MediaAsset | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)

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
          <S.UploadButton onClick={() => setUploadOpen(true)}>
            ↑ Upload Media
          </S.UploadButton>
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

      {/* ── Modals ─────────────────────────────────────────── */}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      {selected && <AssetModal asset={selected} onClose={() => setSelected(null)} />}
    </Box>
  )
}
