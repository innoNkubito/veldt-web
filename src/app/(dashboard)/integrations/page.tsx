'use client'

import { useEffect, useState } from 'react'
import { useClientStore } from '@/stores/clientStore'
import { useProfileStore } from '@/stores/profileStore'
import { confirmDialog } from '@/stores/confirmStore'
import {
  useIntegrationsStore,
  PROCESSOR_META,
  type PaymentProcessorType,
  type ProcessorConnection,
  type ProcessorEnvironment,
} from '@/stores/integrationsStore'
import * as S from './page.styled'

const ENVIRONMENTS: readonly ProcessorEnvironment[] = ['TEST', 'LIVE']

// ── Connect / edit credentials modal ────────────────────────────

function ConnectionModal({
  existing,
  onClose,
}: {
  existing: ProcessorConnection | null // null = create
  onClose: () => void
}) {
  const { createConnection, updateConnection, saving } = useIntegrationsStore()
  const [type] = useState<PaymentProcessorType>(existing?.type ?? 'DPO')
  const meta = PROCESSOR_META[type]

  const [label, setLabel] = useState(existing?.label ?? meta.name)
  const [environment, setEnvironment] = useState<ProcessorEnvironment>(
    existing?.environment ?? 'TEST',
  )
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [supportsCards, setSupportsCards] = useState(existing?.supportsCards ?? true)
  const [supportsAch, setSupportsAch] = useState(existing?.supportsAch ?? meta.defaultSupportsAch)
  const [formError, setFormError] = useState<string | null>(null)

  const credentialsComplete = meta.credentialFields.every((f) => credentials[f.key]?.trim())
  // Editing without touching credentials = keep the stored ones
  const credentialsTouched = Object.values(credentials).some((v) => v.trim())

  async function handleSave() {
    if (saving) return
    if (!label.trim()) {
      setFormError('A label is required')
      return
    }
    if (!existing && !credentialsComplete) {
      setFormError('All credential fields are required')
      return
    }
    if (existing && credentialsTouched && !credentialsComplete) {
      setFormError('Fill in all credential fields, or clear them to keep the existing ones')
      return
    }
    setFormError(null)

    const result = existing
      ? await updateConnection(existing.id, {
          label: label.trim(),
          environment,
          supportsCards,
          supportsAch,
          ...(credentialsTouched ? { credentials } : {}),
        })
      : await createConnection({
          type,
          label: label.trim(),
          environment,
          credentials,
          supportsCards,
          supportsAch,
        })
    if (result) onClose()
  }

  return (
    <S.Overlay onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <S.ModalCard>
        <S.ModalTitle>{existing ? `Edit ${existing.label}` : `Connect ${meta.name}`}</S.ModalTitle>
        <S.FieldNote>{meta.description}</S.FieldNote>

        {formError && <S.ErrorBanner>{formError}</S.ErrorBanner>}

        <S.FieldGroup>
          <S.FieldLabel>Label</S.FieldLabel>
          <S.FieldInput
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={`e.g. ${meta.name} — Main Account`}
          />
        </S.FieldGroup>

        <S.FieldGroup>
          <S.FieldLabel>Environment</S.FieldLabel>
          <S.EnvRow>
            {ENVIRONMENTS.map((env) => (
              <S.EnvOption
                key={env}
                type="button"
                $active={environment === env}
                $live={env === 'LIVE'}
                onClick={() => setEnvironment(env)}
              >
                {env === 'TEST' ? 'Test / Sandbox' : 'Live'}
              </S.EnvOption>
            ))}
          </S.EnvRow>
          {environment === 'TEST' && meta.sandboxHint && (
            <S.FieldNote>{meta.sandboxHint}</S.FieldNote>
          )}
          {environment === 'LIVE' && (
            <S.FieldNote>
              Live mode processes real payments. Double-check these credentials are your production
              ones.
            </S.FieldNote>
          )}
        </S.FieldGroup>

        {meta.credentialFields.map((field) => (
          <S.FieldGroup key={field.key}>
            <S.FieldLabel>{field.label}</S.FieldLabel>
            <S.FieldInput
              type={field.secret ? 'password' : 'text'}
              autoComplete="off"
              value={credentials[field.key] ?? ''}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              placeholder={
                existing && field.secret ? 'Unchanged — enter to replace' : field.placeholder
              }
            />
            {field.hint && <S.FieldNote>{field.hint}</S.FieldNote>}
          </S.FieldGroup>
        ))}
        <S.FieldNote>
          Credentials are encrypted before storage and can never be viewed again — only replaced.
          {existing && ' Leave blank to keep the existing values.'}
        </S.FieldNote>

        <S.CheckRow>
          <input
            type="checkbox"
            checked={supportsCards}
            onChange={(e) => setSupportsCards(e.target.checked)}
          />
          Supports card payments
        </S.CheckRow>
        <S.CheckRow>
          <input
            type="checkbox"
            checked={supportsAch}
            onChange={(e) => setSupportsAch(e.target.checked)}
          />
          Supports ACH / bank transfer
        </S.CheckRow>

        <S.ModalActions>
          <S.CancelButton onClick={onClose}>Cancel</S.CancelButton>
          <S.SaveButton $disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : existing ? 'Save' : 'Connect'}
          </S.SaveButton>
        </S.ModalActions>
      </S.ModalCard>
    </S.Overlay>
  )
}

// ── Page ────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const client = useClientStore((s) => s.client)
  const profile = useProfileStore((s) => s.profile)
  const {
    connections, loading, error,
    fetchConnections, updateConnection, deleteConnection,
  } = useIntegrationsStore()

  const [modal, setModal] = useState<{ open: boolean; existing: ProcessorConnection | null }>({
    open: false,
    existing: null,
  })

  const isOwner = profile?.role === 'OWNER'

  useEffect(() => {
    if (client && isOwner) fetchConnections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, isOwner])

  if (profile && !isOwner) {
    return (
      <S.PageRoot>
        <S.PageTitle>Integrations</S.PageTitle>
        <S.EmptyState style={{ marginTop: 24 }}>
          Only the account owner can manage integrations. Ask your owner to connect a payment
          processor.
        </S.EmptyState>
      </S.PageRoot>
    )
  }

  async function handleToggleStatus(connection: ProcessorConnection) {
    const next = connection.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED'
    if (next === 'DISABLED') {
      const ok = await confirmDialog({
        title: 'Disable connection?',
        message: `"${connection.label}" will stop being available for new bookings. Itineraries using it keep their selection but cannot take payments until re-enabled.`,
        confirmLabel: 'Disable',
        danger: true,
      })
      if (!ok) return
    }
    await updateConnection(connection.id, { status: next })
  }

  async function handleDelete(connection: ProcessorConnection) {
    const ok = await confirmDialog({
      title: 'Remove connection?',
      message: `"${connection.label}" will be removed. Itineraries using it will fall back to no processor selected. This cannot be undone.`,
      confirmLabel: 'Remove',
      danger: true,
    })
    if (!ok) return
    await deleteConnection(connection.id)
  }

  return (
    <S.PageRoot>
      <S.PageHeaderRow>
        <div>
          <S.PageTitle>Integrations</S.PageTitle>
          <S.PageSubtitle>
            Connect payment processors your itineraries can take bookings through.
          </S.PageSubtitle>
        </div>
        <S.ConnectButton onClick={() => setModal({ open: true, existing: null })}>
          + Connect Processor
        </S.ConnectButton>
      </S.PageHeaderRow>

      {error && <S.ErrorBanner>{error}</S.ErrorBanner>}

      <S.SectionTitle>Payment Processors</S.SectionTitle>

      {loading ? (
        <S.LoadingMessage>Loading integrations...</S.LoadingMessage>
      ) : connections.length === 0 ? (
        <S.EmptyState>
          No payment processors connected yet. Connect one to enable “Book through Veldt” on your
          itineraries.
        </S.EmptyState>
      ) : (
        <S.CardGrid>
          {connections.map((connection) => (
            <S.Card key={connection.id}>
              <S.CardTopRow>
                <div>
                  <S.CardName>{connection.label}</S.CardName>
                  <S.CardType>{PROCESSOR_META[connection.type]?.name ?? connection.type}</S.CardType>
                </div>
                <S.ChipStack>
                  <S.StatusChip $status={connection.status}>{connection.status}</S.StatusChip>
                  <S.EnvChip $live={connection.environment === 'LIVE'}>
                    {connection.environment === 'LIVE' ? 'Live' : 'Test'}
                  </S.EnvChip>
                </S.ChipStack>
              </S.CardTopRow>

              <S.Capabilities>
                {connection.supportsCards && <S.CapabilityChip>Cards</S.CapabilityChip>}
                {connection.supportsAch && <S.CapabilityChip>ACH</S.CapabilityChip>}
              </S.Capabilities>

              <S.CardMeta>
                Connected {new Date(Number(connection.createdAt) || connection.createdAt).toLocaleDateString()}
              </S.CardMeta>

              <S.CardActions>
                <S.CardActionLink onClick={() => setModal({ open: true, existing: connection })}>
                  Edit
                </S.CardActionLink>
                <S.CardActionLink onClick={() => handleToggleStatus(connection)}>
                  {connection.status === 'DISABLED' ? 'Enable' : 'Disable'}
                </S.CardActionLink>
                <S.CardActionLink $danger onClick={() => handleDelete(connection)}>
                  Remove
                </S.CardActionLink>
              </S.CardActions>
            </S.Card>
          ))}
        </S.CardGrid>
      )}

      {modal.open && (
        <ConnectionModal
          existing={modal.existing}
          onClose={() => setModal({ open: false, existing: null })}
        />
      )}
    </S.PageRoot>
  )
}
