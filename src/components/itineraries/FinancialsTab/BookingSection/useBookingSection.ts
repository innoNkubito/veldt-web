'use client'

import { useEffect, useMemo, useState } from 'react'
import { useBuilderStore } from '@/stores/builderStore'
import { useClientStore } from '@/stores/clientStore'
import { useProfileStore } from '@/stores/profileStore'
import { useIntegrationsStore, PROCESSOR_META } from '@/stores/integrationsStore'
import { useBookingStore } from '@/stores/bookingStore'
import { focusSection } from '@/lib/focusSection'
import { nextSetupSection, setupSteps } from './BookingSetupChecklist'
import type { BookingForm, SetBookingField } from './BookingSection.types'
import { formFromConfig, packageFromQuote, toConfigInput } from './BookingSection.utils'

/**
 * The booking settings form, the processor connections, and the setup
 * tracker. Packages, add-ons and the schedule are saved by their own cards.
 */
export function useBookingSection() {
  const client = useClientStore((s) => s.client)
  const profile = useProfileStore((s) => s.profile)
  const itinerary = useBuilderStore((s) => s.itinerary)
  const { config, loading, saving, error, fetchConfig, saveConfig, setError } = useBookingStore()
  const { connections, fetchConnections } = useIntegrationsStore()

  const [form, setForm] = useState<BookingForm>(() => formFromConfig(null))
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (client && itinerary?.id) {
      fetchConfig(itinerary.id)
      fetchConnections()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, itinerary?.id])

  // Load the form whenever a different (or newly saved) config arrives —
  // adjusted during render rather than in an effect, so there is no frame
  // showing the stale form.
  const configVersion = config ? `${config.id}:${config.updatedAt}` : null
  const [loadedVersion, setLoadedVersion] = useState<string | null>(null)
  if (config && configVersion !== loadedVersion) {
    setLoadedVersion(configVersion)
    setForm(formFromConfig(config))
    setDirty(false)
  }

  const setF: SetBookingField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
  }

  const activeConnections = useMemo(() => connections.filter((c) => c.status !== 'DISABLED'), [connections])
  const selectedConnection = useMemo(
    () => connections.find((c) => c.id === form.processorConnectionId) ?? null,
    [connections, form.processorConnectionId],
  )
  // The setup tracker reads what is saved — the same thing publishing checks.
  const savedConnection = useMemo(
    () => connections.find((c) => c.id === config?.processorConnectionId) ?? null,
    [connections, config?.processorConnectionId],
  )
  const steps = setupSteps({
    processorReady: !!savedConnection && savedConnection.status !== 'DISABLED',
    processorUnsaved:
      !!form.processorConnectionId && form.processorConnectionId !== (config?.processorConnectionId ?? ''),
    packageCount: config?.packages.length ?? 0,
    scheduleCount: config?.scheduleItems.length ?? 0,
  })

  /** After a setup step is saved, point at the next one still missing. */
  function promptNextStep() {
    const saved = useBookingStore.getState().config
    if (saved?.bookingMode !== 'VELDT') return
    const processor = connections.find((c) => c.id === saved.processorConnectionId)
    const next = nextSetupSection(
      setupSteps({
        processorReady: !!processor && processor.status !== 'DISABLED',
        processorUnsaved: false,
        packageCount: saved.packages.length,
        scheduleCount: saved.scheduleItems.length,
      }),
    )
    if (next) focusSection(next)
  }

  async function saveSettings() {
    if (!itinerary) return
    const message = await saveConfig(itinerary.id, toConfigInput(form))
    if (message) return
    setDirty(false)
    promptNextStep()
  }

  const showVeldtSections = form.bookingMode === 'VELDT'

  return {
    config,
    loading,
    saving,
    error,
    clearError: () => setError(null),
    form,
    setF,
    dirty,
    saveSettings,
    promptNextStep,
    steps,
    isOwner: profile?.role === 'OWNER',
    isTemplate: itinerary?.kind === 'TEMPLATE',
    // The quote's currency; the API copies it to the booking config
    currency: config?.currency ?? itinerary?.costs?.currency ?? 'USD',
    quotePackage: packageFromQuote(itinerary?.costs ?? null),
    activeConnections,
    selectedConnection,
    processorName: selectedConnection
      ? (PROCESSOR_META[selectedConnection.type]?.name ?? selectedConnection.type)
      : 'your payment processor',
    showVeldtSections,
    needsProcessor: showVeldtSections && activeConnections.length === 0,
  }
}
