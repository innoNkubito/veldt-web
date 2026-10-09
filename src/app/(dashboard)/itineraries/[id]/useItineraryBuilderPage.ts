import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useBuilderStore } from '@/stores/builderStore'
import type { TripDetailsInput } from '@/stores/builderStore'
import { useClientStore } from '@/stores/clientStore'
import { useProfileStore } from '@/stores/profileStore'
import { useTemplateStore, type TemplateDetailsInput } from '@/stores/templateStore'
import { confirmDialog } from '@/stores/confirmStore'
import { routeParam } from '@/lib/guards'
import { ARCHIVE_DIALOG, COMPLETE_TRIP_DIALOG, UNDO_CONFIRM_DIALOG } from './page.constants'
import { resolveTab, shareLinkUrl, visibleTabs } from './page.utils'
import type { BuilderTab } from './page.types'

/**
 * Loads the itinerary and owns the header's status actions and modals. Every
 * action's error lands in one banner (`actionError`) above the tabs.
 */
export function useItineraryBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const id = routeParam(params?.id)
  const client = useClientStore((s) => s.client)
  const role = useProfileStore((s) => s.profile?.role)
  const saveAsTemplate = useTemplateStore((s) => s.saveAsTemplate)
  const {
    itinerary,
    loading,
    error,
    saving,
    fetchItinerary,
    publishItinerary,
    setItineraryStatus,
    restoreItinerary,
  } = useBuilderStore()

  const [activeTab, setActiveTab] = useState<BuilderTab>('overview')
  const [showPublish, setShowPublish] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [showConfirmTrip, setShowConfirmTrip] = useState(false)
  const [showStartTrip, setShowStartTrip] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [showUseTemplate, setShowUseTemplate] = useState(false)

  useEffect(() => {
    if (client && id) fetchItinerary(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, id])

  /** Runs a status change; on success closes `onSuccess`'s modal and clears the banner. */
  async function changeStatus(change: () => Promise<string | null>, onSuccess?: () => void) {
    const err = await change()
    setActionError(err)
    if (!err) onSuccess?.()
    return err
  }

  async function publish() {
    if (!itinerary) return
    setPublishing(true)
    const err = await publishItinerary(itinerary.id)
    setPublishing(false)
    setShowPublish(false)
    setActionError(err ? err.replace('VALIDATION: ', '') : null)
  }

  async function confirmTrip(trip: TripDetailsInput, notifyTraveller: boolean) {
    if (!itinerary) return null
    const err = await setItineraryStatus(itinerary.id, 'CONFIRMED', trip, notifyTraveller)
    // Errors are shown inside the Confirm modal, which stays open
    if (!err) {
      setShowConfirmTrip(false)
      setActionError(null)
    }
    return err
  }

  async function startTrip(notifyTraveller: boolean) {
    if (!itinerary) return null
    const err = await setItineraryStatus(itinerary.id, 'TRAVELLING', undefined, notifyTraveller)
    if (!err) {
      setShowStartTrip(false)
      setActionError(null)
    }
    return err
  }

  async function undoConfirm() {
    if (!itinerary || !(await confirmDialog(UNDO_CONFIRM_DIALOG))) return
    await changeStatus(() => setItineraryStatus(itinerary.id, 'PUBLISHED'))
  }

  async function archive() {
    if (!itinerary || !(await confirmDialog(ARCHIVE_DIALOG))) return
    await changeStatus(() => setItineraryStatus(itinerary.id, 'ARCHIVED'))
  }

  async function completeTrip() {
    if (!itinerary || !(await confirmDialog(COMPLETE_TRIP_DIALOG))) return
    await changeStatus(() => setItineraryStatus(itinerary.id, 'COMPLETED'))
  }

  async function restore() {
    if (!itinerary) return
    await changeStatus(() => restoreItinerary(itinerary.id))
  }

  /** Saves a copy as a template and opens it; errors stay in the modal. */
  async function saveTemplate(input: TemplateDetailsInput) {
    if (!itinerary) return null
    const result = await saveAsTemplate(itinerary.id, input)
    if (!result.ok) return result.error
    setShowSaveTemplate(false)
    router.push(`/itineraries/${result.value}`)
    return null
  }

  function copyShareLink() {
    if (itinerary) navigator.clipboard.writeText(shareLinkUrl(window.location.origin, itinerary.slug))
  }

  const status = itinerary?.status
  const isTemplate = itinerary?.kind === 'TEMPLATE'
  // Calendar itineraries have no relative-date form yet; viewers only use templates.
  const canSaveTemplate =
    !!itinerary && !isTemplate && itinerary.builderMode !== 'CALENDAR' && role !== 'VIEWER'

  return {
    itinerary,
    loading,
    error,
    saving,
    status,
    isTemplate,
    canSaveTemplate,
    tabs: visibleTabs(status),
    currentTab: resolveTab(activeTab, status),
    setActiveTab,
    actionError,
    dismissError: () => setActionError(null),
    copyShareLink,
    publishModal: {
      open: showPublish,
      show: () => setShowPublish(true),
      close: () => setShowPublish(false),
      publishing,
      publish,
    },
    confirmTripModal: {
      open: showConfirmTrip,
      show: () => setShowConfirmTrip(true),
      close: () => setShowConfirmTrip(false),
      confirmTrip,
    },
    startTripModal: {
      open: showStartTrip,
      show: () => setShowStartTrip(true),
      close: () => setShowStartTrip(false),
      startTrip,
    },
    saveTemplateModal: {
      open: showSaveTemplate,
      show: () => setShowSaveTemplate(true),
      close: () => setShowSaveTemplate(false),
      save: saveTemplate,
    },
    useTemplateModal: {
      open: showUseTemplate,
      show: () => setShowUseTemplate(true),
      close: () => setShowUseTemplate(false),
    },
    undoConfirm,
    archive,
    completeTrip,
    restore,
  }
}
