'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBuilderStore } from '@/stores/builderStore'
import { useClientStore } from '@/stores/clientStore'
import { useProfileStore } from '@/stores/profileStore'
import { useIntegrationsStore, PROCESSOR_META } from '@/stores/integrationsStore'
import { confirmDialog } from '@/stores/confirmStore'
import {
  useBookingStore,
  BOOKING_CURRENCIES,
  AMOUNT_TYPE_LABELS,
  type BookingMode,
  type BookingFlowType,
  type SurchargePayer,
  type ScheduleAmountType,
  type BookingPackage,
  type BookingAddon,
  type ScheduleItemInput,
} from '@/stores/bookingStore'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import {
  Field,
  FieldLabel,
  FieldInput,
  FieldTextarea,
  FieldSelect,
} from '@/components/itineraries/shared/FieldPrimitives'
import HtmlRichTextEditor from '@/components/itineraries/HtmlRichTextEditor'
import PackageModal from './PackageModal'
import AddonModal from './AddonModal'
import * as S from './BookingTab.styled'

const MODES: { key: BookingMode; name: string; desc: string }[] = [
  { key: 'OFF', name: 'Not bookable', desc: 'No booking button on the client view.' },
  { key: 'VELDT', name: 'Book through Veldt', desc: 'Clients book and pay through your processor.' },
  { key: 'EXTERNAL', name: 'External link', desc: 'Send clients to your own booking page or contact.' },
]

// Draft row for the schedule editor (all strings for controlled inputs)
interface ScheduleDraft {
  description: string
  dueAtBooking: boolean
  dueDate: string // yyyy-mm-dd
  amountType: ScheduleAmountType
  amountValue: string
}

function toDraft(item: {
  description: string
  dueAtBooking: boolean
  dueDate: string | null
  amountType: ScheduleAmountType
  amountValue: number | null
}): ScheduleDraft {
  return {
    description: item.description,
    dueAtBooking: item.dueAtBooking,
    dueDate: item.dueDate ? item.dueDate.slice(0, 10) : '',
    amountType: item.amountType,
    amountValue: item.amountValue != null ? String(item.amountValue) : '',
  }
}

const BLANK_FIRST: ScheduleDraft = {
  description: 'Deposit',
  dueAtBooking: true,
  dueDate: '',
  amountType: 'PERCENT_OF_TOTAL',
  amountValue: '30',
}

export default function BookingTab() {
  const router = useRouter()
  const client = useClientStore((s) => s.client)
  const profile = useProfileStore((s) => s.profile)
  const itinerary = useBuilderStore((s) => s.itinerary)
  const {
    config, loading, saving, error,
    fetchConfig, saveConfig,
    addPackage, editPackage, removePackage,
    addAddon, editAddon, removeAddon,
    saveSchedule, setError,
  } = useBookingStore()
  const { connections, fetchConnections } = useIntegrationsStore()

  const isOwner = profile?.role === 'OWNER'

  // ── Settings form ──────────────────────────────────────────
  const [form, setForm] = useState({
    bookingMode: 'OFF' as BookingMode,
    externalUrl: '',
    externalContact: '',
    flowType: 'INSTANT' as BookingFlowType,
    currency: 'USD',
    processorConnectionId: '',
    companyInfo: '',
    invoiceNotes: '',
    termsAndConditions: '',
    allowCardPayments: false,
    surchargePayer: 'CLIENT' as SurchargePayer,
    surchargePercent: '',
    achEnabled: false,
    reminderDaysBefore: [] as number[],
  })
  const [dirty, setDirty] = useState(false)
  const [reminderDraft, setReminderDraft] = useState('')

  // ── Modals ─────────────────────────────────────────────────
  const [packageModal, setPackageModal] = useState<{ open: boolean; existing: BookingPackage | null }>(
    { open: false, existing: null },
  )
  const [addonModal, setAddonModal] = useState<{ open: boolean; existing: BookingAddon | null }>(
    { open: false, existing: null },
  )

  // ── Schedule editor ────────────────────────────────────────
  const [schedule, setSchedule] = useState<ScheduleDraft[]>([])
  const [scheduleDirty, setScheduleDirty] = useState(false)

  useEffect(() => {
    if (client && itinerary?.id) {
      fetchConfig(itinerary.id)
      fetchConnections()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, itinerary?.id])

  useEffect(() => {
    if (!config) return
    setForm({
      bookingMode: config.bookingMode,
      externalUrl: config.externalUrl ?? '',
      externalContact: config.externalContact ?? '',
      flowType: config.flowType,
      currency: config.currency,
      processorConnectionId: config.processorConnectionId ?? '',
      companyInfo: config.companyInfo ?? '',
      invoiceNotes: config.invoiceNotes ?? '',
      termsAndConditions: config.termsAndConditions ?? '',
      allowCardPayments: config.allowCardPayments,
      surchargePayer: config.surchargePayer ?? 'CLIENT',
      surchargePercent: config.surchargePercent != null ? String(config.surchargePercent) : '',
      achEnabled: config.achEnabled,
      reminderDaysBefore: config.reminderDaysBefore,
    })
    setSchedule(config.scheduleItems.map(toDraft))
    setDirty(false)
    setScheduleDirty(false)
  }, [config?.id, config?.updatedAt])

  function setF<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
  }

  const activeConnections = useMemo(
    () => connections.filter((c) => c.status !== 'DISABLED'),
    [connections],
  )
  const selectedConnection = useMemo(
    () => connections.find((c) => c.id === form.processorConnectionId) ?? null,
    [connections, form.processorConnectionId],
  )
  const processorName = selectedConnection
    ? PROCESSOR_META[selectedConnection.type]?.name ?? selectedConnection.type
    : 'your payment processor'

  // ── Save settings ──────────────────────────────────────────

  async function handleSaveSettings() {
    if (!itinerary) return
    const message = await saveConfig(itinerary.id, {
      bookingMode: form.bookingMode,
      externalUrl: form.externalUrl.trim() || null,
      externalContact: form.externalContact.trim() || null,
      flowType: form.flowType,
      currency: form.currency,
      processorConnectionId: form.processorConnectionId || null,
      companyInfo: form.companyInfo.trim() || null,
      invoiceNotes: form.invoiceNotes || null,
      termsAndConditions: form.termsAndConditions || null,
      allowCardPayments: form.allowCardPayments,
      surchargePayer: form.allowCardPayments ? form.surchargePayer : null,
      surchargePercent:
        form.allowCardPayments && form.surchargePercent
          ? parseFloat(form.surchargePercent)
          : null,
      achEnabled: form.achEnabled,
      reminderDaysBefore: form.reminderDaysBefore,
    })
    if (!message) setDirty(false)
  }

  // ── Packages / addons ──────────────────────────────────────

  async function handleDeletePackage(pkg: BookingPackage) {
    const ok = await confirmDialog({
      title: 'Remove package?',
      message: `"${pkg.name}" will no longer be bookable. Existing bookings are unaffected.`,
      confirmLabel: 'Remove',
      danger: true,
    })
    if (ok) await removePackage(pkg.id)
  }

  async function handleDeleteAddon(addon: BookingAddon) {
    const ok = await confirmDialog({
      title: 'Remove add-on?',
      message: `"${addon.name}" will no longer be offered at checkout. Existing bookings are unaffected.`,
      confirmLabel: 'Remove',
      danger: true,
    })
    if (ok) await removeAddon(addon.id)
  }

  // ── Schedule editing ───────────────────────────────────────

  function updateScheduleRow(index: number, patch: Partial<ScheduleDraft>) {
    setSchedule((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)))
    setScheduleDirty(true)
  }

  function addScheduleRow() {
    setSchedule((rows) =>
      rows.length === 0
        ? [BLANK_FIRST]
        : [
            ...rows,
            {
              description: `Payment ${rows.length + 1}`,
              dueAtBooking: false,
              dueDate: '',
              amountType: 'REMAINING_BALANCE',
              amountValue: '',
            },
          ],
    )
    setScheduleDirty(true)
  }

  function removeScheduleRow(index: number) {
    setSchedule((rows) => {
      const next = rows.filter((_, i) => i !== index)
      // The first payment is always the one due at booking — re-anchor after a delete
      return next.map((row, i) =>
        i === 0
          ? { ...row, dueAtBooking: true, dueDate: '' }
          : { ...row, dueAtBooking: false },
      )
    })
    setScheduleDirty(true)
  }

  async function handleSaveSchedule() {
    const items: ScheduleItemInput[] = schedule.map((row) => ({
      description: row.description.trim(),
      dueAtBooking: row.dueAtBooking,
      dueDate: row.dueAtBooking ? null : row.dueDate || null,
      amountType: row.amountType,
      amountValue:
        row.amountType === 'REMAINING_BALANCE' || !row.amountValue
          ? null
          : parseFloat(row.amountValue),
    }))
    const message = await saveSchedule(items)
    if (!message) setScheduleDirty(false)
  }

  // Live validation summary for the schedule
  const scheduleSummary = useMemo(() => {
    if (schedule.length === 0) return { valid: true, text: 'No payment schedule set yet.' }
    const percentSum = schedule
      .filter((r) => r.amountType === 'PERCENT_OF_TOTAL')
      .reduce((sum, r) => sum + (parseFloat(r.amountValue) || 0), 0)
    const hasRemainder = schedule.some((r) => r.amountType === 'REMAINING_BALANCE')
    const fixedSum = schedule
      .filter((r) => r.amountType === 'FIXED')
      .reduce((sum, r) => sum + (parseFloat(r.amountValue) || 0), 0)

    if (percentSum > 100) {
      return { valid: false, text: `Percentages total ${percentSum}% — that's over 100%.` }
    }
    if (hasRemainder) {
      const parts = [
        percentSum > 0 ? `${percentSum}% in percentages` : null,
        fixedSum > 0 ? `${fixedSum.toLocaleString()} ${form.currency} fixed` : null,
      ].filter(Boolean)
      return {
        valid: true,
        text: parts.length
          ? `${parts.join(' + ')}, then the remaining balance.`
          : 'The full amount is collected as the remaining balance.',
      }
    }
    if (fixedSum === 0 && Math.abs(percentSum - 100) > 0.01) {
      return {
        valid: false,
        text: `Percentages total ${percentSum}% — they must reach 100%, or add a remaining balance payment.`,
      }
    }
    return { valid: true, text: 'Schedule adds up.' }
  }, [schedule, form.currency])

  // ── Render ─────────────────────────────────────────────────

  if (loading) return <S.LoadingMessage>Loading booking settings...</S.LoadingMessage>

  const showVeldtSections = form.bookingMode === 'VELDT'
  const needsProcessor = showVeldtSections && activeConnections.length === 0
  const configSaved = config != null

  return (
    <div>
      {error && <S.ErrorBanner onClick={() => setError(null)}>{error}</S.ErrorBanner>}

      {/* ── Bookability ──────────────────────────────────── */}
      <S.Card>
        <S.CardTitleRow>
          <S.CardTitle>Make Bookable</S.CardTitle>
        </S.CardTitleRow>

        <S.ModeRow>
          {MODES.map((mode) => (
            <S.ModeCard
              key={mode.key}
              $active={form.bookingMode === mode.key}
              onClick={() => setF('bookingMode', mode.key)}
            >
              <S.ModeName $active={form.bookingMode === mode.key}>{mode.name}</S.ModeName>
              <S.ModeDesc>{mode.desc}</S.ModeDesc>
            </S.ModeCard>
          ))}
        </S.ModeRow>

        {form.bookingMode === 'EXTERNAL' && (
          <>
            <S.Spacer />
            <S.Grid>
              <Field>
                <FieldLabel>Booking Link</FieldLabel>
                <FieldInput
                  value={form.externalUrl}
                  onChange={(e) => setF('externalUrl', e.target.value)}
                  placeholder="https://…"
                />
              </Field>
              <Field>
                <FieldLabel>Or Contact Info</FieldLabel>
                <FieldInput
                  value={form.externalContact}
                  onChange={(e) => setF('externalContact', e.target.value)}
                  placeholder="e.g. bookings@example.com"
                />
              </Field>
            </S.Grid>
          </>
        )}
      </S.Card>

      {needsProcessor && (
        <S.Callout $tone="warn">
          No payment processor is connected yet — booking through Veldt needs one.{' '}
          {isOwner ? (
            <S.CalloutLink onClick={() => router.push('/integrations')}>
              Go to Integrations
            </S.CalloutLink>
          ) : (
            'Ask your account owner to connect one on the Integrations page.'
          )}
        </S.Callout>
      )}

      {showVeldtSections && (
        <>
          {/* ── Packages ───────────────────────────────────── */}
          <S.Card>
            <S.CardTitleRow>
              <S.CardTitle>Packages</S.CardTitle>
              <ActionButton
                $variant="outline"
                $disabled={!configSaved}
                onClick={() => configSaved && setPackageModal({ open: true, existing: null })}
              >
                + Add Package
              </ActionButton>
            </S.CardTitleRow>

            {!configSaved ? (
              <S.EmptyRow>Save your booking settings below to start adding packages.</S.EmptyRow>
            ) : config!.packages.length === 0 ? (
              <S.EmptyRow>No packages yet. Clients need at least one to book.</S.EmptyRow>
            ) : (
              <S.ItemList>
                {config!.packages.map((pkg) => (
                  <S.ItemRow key={pkg.id}>
                    <S.ItemMain>
                      <S.ItemName>{pkg.name}</S.ItemName>
                      {pkg.description && <S.ItemDesc>{pkg.description}</S.ItemDesc>}
                      <S.ItemMeta>
                        {pkg.peopleIncluded} {pkg.peopleIncluded === 1 ? 'person' : 'people'} ·{' '}
                        {pkg.totalAvailable} available
                      </S.ItemMeta>
                    </S.ItemMain>
                    <S.ItemPrice>
                      {form.currency} {pkg.price.toLocaleString()}
                    </S.ItemPrice>
                    <S.ItemActions>
                      <S.LinkButton onClick={() => setPackageModal({ open: true, existing: pkg })}>
                        Edit
                      </S.LinkButton>
                      <S.LinkButton $danger onClick={() => handleDeletePackage(pkg)}>
                        Remove
                      </S.LinkButton>
                    </S.ItemActions>
                  </S.ItemRow>
                ))}
              </S.ItemList>
            )}
          </S.Card>

          {/* ── Add-ons ────────────────────────────────────── */}
          <S.Card>
            <S.CardTitleRow>
              <S.CardTitle>Add-ons</S.CardTitle>
              <ActionButton
                $variant="outline"
                $disabled={!configSaved}
                onClick={() => configSaved && setAddonModal({ open: true, existing: null })}
              >
                + Add Add-on
              </ActionButton>
            </S.CardTitleRow>

            {!configSaved ? (
              <S.EmptyRow>Save your booking settings below to start adding add-ons.</S.EmptyRow>
            ) : config!.addons.length === 0 ? (
              <S.EmptyRow>No add-ons — optional extras clients can add at checkout.</S.EmptyRow>
            ) : (
              <S.ItemList>
                {config!.addons.map((addon) => (
                  <S.ItemRow key={addon.id}>
                    <S.ItemMain>
                      <S.ItemName>{addon.name}</S.ItemName>
                      {addon.description && <S.ItemDesc>{addon.description}</S.ItemDesc>}
                      <S.ItemMeta>
                        {addon.limitCount != null
                          ? `Covers up to ${addon.limitCount} guests`
                          : 'No guest limit'}
                      </S.ItemMeta>
                    </S.ItemMain>
                    <S.ItemPrice>
                      {form.currency} {addon.perPersonPrice.toLocaleString()}
                      <div style={{ fontSize: 10.5, fontWeight: 400, opacity: 0.65 }}>per person</div>
                    </S.ItemPrice>
                    <S.ItemActions>
                      <S.LinkButton onClick={() => setAddonModal({ open: true, existing: addon })}>
                        Edit
                      </S.LinkButton>
                      <S.LinkButton $danger onClick={() => handleDeleteAddon(addon)}>
                        Remove
                      </S.LinkButton>
                    </S.ItemActions>
                  </S.ItemRow>
                ))}
              </S.ItemList>
            )}
          </S.Card>
        </>
      )}

      {/* ── Invoice settings ──────────────────────────────── */}
      {showVeldtSections && (
        <S.Card>
          <S.CardTitleRow>
            <S.CardTitle>Invoice Settings</S.CardTitle>
          </S.CardTitleRow>

          {selectedConnection?.environment === 'TEST' && (
            <S.Callout $tone="warn">
              <strong>{selectedConnection.label}</strong> is a test/sandbox connection — no real
              money moves and payments always succeed. Switch to a live connection before sending
              this itinerary to a client.
            </S.Callout>
          )}

          <S.Grid>
            <Field>
              <FieldLabel>Payment Processor</FieldLabel>
              <FieldSelect
                value={form.processorConnectionId}
                onChange={(e) => setF('processorConnectionId', e.target.value)}
              >
                <option value="">No processor selected</option>
                {activeConnections.map((connection) => (
                  <option key={connection.id} value={connection.id}>
                    {connection.label}
                    {connection.environment === 'TEST' ? ' (Test)' : ''}
                  </option>
                ))}
              </FieldSelect>
            </Field>
            <Field>
              <FieldLabel>Currency</FieldLabel>
              <FieldSelect value={form.currency} onChange={(e) => setF('currency', e.target.value)}>
                {BOOKING_CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </FieldSelect>
            </Field>
            <S.FullRow>
              <Field>
                <FieldLabel>Booking Flow</FieldLabel>
                <FieldSelect
                  value={form.flowType}
                  onChange={(e) => setF('flowType', e.target.value as BookingFlowType)}
                >
                  <option value="INSTANT">Instant — client pays the first payment at booking</option>
                  <option value="REQUEST">Request — you review, then send an invoice</option>
                </FieldSelect>
              </Field>
            </S.FullRow>
            <S.FullRow>
              <Field>
                <FieldLabel>Company Info</FieldLabel>
                <FieldTextarea
                  value={form.companyInfo}
                  onChange={(e) => setF('companyInfo', e.target.value)}
                  placeholder="Legal name, address, tax/VAT number — shown on invoices"
                />
              </Field>
            </S.FullRow>
          </S.Grid>

          <S.Spacer />
          <FieldLabel>Invoice Notes</FieldLabel>
          <HtmlRichTextEditor
            content={form.invoiceNotes}
            onChange={(html) => setF('invoiceNotes', html)}
            placeholder="Notes shown on the invoice…"
          />

          <S.Spacer />
          <FieldLabel>Terms &amp; Conditions</FieldLabel>
          <HtmlRichTextEditor
            content={form.termsAndConditions}
            onChange={(html) => setF('termsAndConditions', html)}
            placeholder="Booking terms clients accept at checkout…"
          />
        </S.Card>
      )}

      {/* ── Payment schedule ──────────────────────────────── */}
      {showVeldtSections && (
        <S.Card>
          <S.CardTitleRow>
            <S.CardTitle>Payment Schedule</S.CardTitle>
            <ActionButton
              $variant="outline"
              $disabled={!configSaved}
              onClick={() => configSaved && addScheduleRow()}
            >
              + Add Payment
            </ActionButton>
          </S.CardTitleRow>

          <S.CardHint>
            The first payment is always due at booking. Later payments can be a fixed amount, a
            percentage of the total, or whatever balance remains.
          </S.CardHint>

          {!configSaved ? (
            <S.EmptyRow>Save your booking settings below to set up a payment schedule.</S.EmptyRow>
          ) : schedule.length === 0 ? (
            <S.EmptyRow>
              No payments configured — add one to start collecting at booking.
            </S.EmptyRow>
          ) : (
            <>
              <S.ScheduleHeaderRow>
                <S.ScheduleHeaderCell>#</S.ScheduleHeaderCell>
                <S.ScheduleHeaderCell>Description</S.ScheduleHeaderCell>
                <S.ScheduleHeaderCell>Due</S.ScheduleHeaderCell>
                <S.ScheduleHeaderCell>Amount Type</S.ScheduleHeaderCell>
                <S.ScheduleHeaderCell>Amount</S.ScheduleHeaderCell>
                <S.ScheduleHeaderCell />
              </S.ScheduleHeaderRow>

              {schedule.map((row, index) => (
                <S.ScheduleRow key={index}>
                  <S.ScheduleIndex>{index + 1}</S.ScheduleIndex>

                  <FieldInput
                    value={row.description}
                    onChange={(e) => updateScheduleRow(index, { description: e.target.value })}
                    placeholder="e.g. Deposit"
                  />

                  {index === 0 ? (
                    <S.ScheduleLockNote>At booking</S.ScheduleLockNote>
                  ) : (
                    <FieldInput
                      type="date"
                      value={row.dueDate}
                      onChange={(e) => updateScheduleRow(index, { dueDate: e.target.value })}
                    />
                  )}

                  <FieldSelect
                    value={row.amountType}
                    onChange={(e) =>
                      updateScheduleRow(index, {
                        amountType: e.target.value as ScheduleAmountType,
                        ...(e.target.value === 'REMAINING_BALANCE' ? { amountValue: '' } : {}),
                      })
                    }
                  >
                    {(Object.keys(AMOUNT_TYPE_LABELS) as ScheduleAmountType[]).map((key) => (
                      <option key={key} value={key}>
                        {AMOUNT_TYPE_LABELS[key]}
                      </option>
                    ))}
                  </FieldSelect>

                  {row.amountType === 'REMAINING_BALANCE' ? (
                    <S.ScheduleLockNote>Whatever remains</S.ScheduleLockNote>
                  ) : (
                    <FieldInput
                      type="number"
                      min={0}
                      step="0.01"
                      value={row.amountValue}
                      onChange={(e) => updateScheduleRow(index, { amountValue: e.target.value })}
                      placeholder={row.amountType === 'PERCENT_OF_TOTAL' ? '%' : form.currency}
                    />
                  )}

                  <S.LinkButton $danger onClick={() => removeScheduleRow(index)}>
                    ✕
                  </S.LinkButton>
                </S.ScheduleRow>
              ))}

              <S.ScheduleTotalRow $valid={scheduleSummary.valid}>
                {scheduleSummary.text}
              </S.ScheduleTotalRow>

              <S.SaveBar>
                {scheduleDirty && <S.DirtyNote>Unsaved schedule changes</S.DirtyNote>}
                <ActionButton
                  $variant="primary"
                  $disabled={saving || !scheduleDirty}
                  onClick={() => scheduleDirty && !saving && handleSaveSchedule()}
                >
                  {saving ? 'Saving…' : 'Save Schedule'}
                </ActionButton>
              </S.SaveBar>
            </>
          )}
        </S.Card>
      )}

      {/* ── Card & alternative payments ───────────────────── */}
      {showVeldtSections && (
        <S.Card>
          <S.CardTitleRow>
            <S.CardTitle>Card &amp; Alternative Payments</S.CardTitle>
          </S.CardTitleRow>

          <S.ToggleRow>
            <input
              type="checkbox"
              checked={form.allowCardPayments}
              onChange={(e) => setF('allowCardPayments', e.target.checked)}
            />
            <S.ToggleLabelText>
              Allow card payments
              <S.ToggleHint>Lets clients pay installments by credit or debit card.</S.ToggleHint>
            </S.ToggleLabelText>
          </S.ToggleRow>

          {form.allowCardPayments && (
            <>
              <S.Spacer />
              <S.Grid>
                <Field>
                  <FieldLabel>Who Covers the Surcharge</FieldLabel>
                  <FieldSelect
                    value={form.surchargePayer}
                    onChange={(e) => setF('surchargePayer', e.target.value as SurchargePayer)}
                  >
                    <option value="CLIENT">Client covers the surcharge</option>
                    <option value="OPERATOR">We cover the surcharge</option>
                  </FieldSelect>
                </Field>
                <Field>
                  <FieldLabel>Surcharge %</FieldLabel>
                  <FieldInput
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    value={form.surchargePercent}
                    onChange={(e) => setF('surchargePercent', e.target.value)}
                    placeholder="e.g. 3"
                  />
                </Field>
              </S.Grid>
              <S.Spacer />
              <S.Callout $tone="warn">
                Credit card surcharging is regulated differently by region and by card. It&apos;s
                your responsibility to ensure it is permitted. This surcharging solution is only
                possible if card payments are not enabled directly in {processorName}.
              </S.Callout>
            </>
          )}

          <S.ToggleRow>
            <input
              type="checkbox"
              checked={form.achEnabled}
              disabled={!selectedConnection?.supportsAch}
              onChange={(e) => setF('achEnabled', e.target.checked)}
            />
            <S.ToggleLabelText>
              Enable ACH / bank transfer
              <S.ToggleHint>
                {selectedConnection?.supportsAch
                  ? 'Offers bank transfer alongside card payments.'
                  : 'Unavailable — the selected processor connection does not support ACH.'}
              </S.ToggleHint>
            </S.ToggleLabelText>
          </S.ToggleRow>
        </S.Card>
      )}

      {/* ── Reminders ─────────────────────────────────────── */}
      {showVeldtSections && (
        <S.Card>
          <S.CardTitleRow>
            <S.CardTitle>Payment Reminders</S.CardTitle>
          </S.CardTitleRow>
          <S.CardHint>
            Email the client a payment link this many days before each due date.
          </S.CardHint>

          <S.ChipRow>
            {form.reminderDaysBefore.map((days) => (
              <S.Chip key={days}>
                {days} {days === 1 ? 'day' : 'days'} before
                <S.ChipRemove
                  onClick={() =>
                    setF(
                      'reminderDaysBefore',
                      form.reminderDaysBefore.filter((d) => d !== days),
                    )
                  }
                >
                  ✕
                </S.ChipRemove>
              </S.Chip>
            ))}
            <S.ChipInput
              type="number"
              min={1}
              max={365}
              value={reminderDraft}
              onChange={(e) => setReminderDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return
                e.preventDefault()
                const days = parseInt(reminderDraft, 10)
                if (!Number.isInteger(days) || days < 1 || days > 365) return
                if (!form.reminderDaysBefore.includes(days)) {
                  setF(
                    'reminderDaysBefore',
                    [...form.reminderDaysBefore, days].sort((a, b) => b - a),
                  )
                }
                setReminderDraft('')
              }}
              placeholder="Days + Enter"
            />
          </S.ChipRow>
        </S.Card>
      )}

      {/* ── Save settings ─────────────────────────────────── */}
      <S.SaveBar>
        {dirty && <S.DirtyNote>You have unsaved changes</S.DirtyNote>}
        <ActionButton
          $variant="primary"
          $disabled={saving || !dirty}
          onClick={() => dirty && !saving && handleSaveSettings()}
        >
          {saving ? 'Saving…' : 'Save Booking Settings'}
        </ActionButton>
      </S.SaveBar>

      {/* ── Modals ────────────────────────────────────────── */}
      {packageModal.open && (
        <PackageModal
          existing={packageModal.existing}
          currency={form.currency}
          saving={saving}
          onSave={(input) =>
            packageModal.existing
              ? editPackage(packageModal.existing.id, input)
              : addPackage(input)
          }
          onClose={() => setPackageModal({ open: false, existing: null })}
        />
      )}
      {addonModal.open && (
        <AddonModal
          existing={addonModal.existing}
          currency={form.currency}
          saving={saving}
          onSave={(input) =>
            addonModal.existing ? editAddon(addonModal.existing.id, input) : addAddon(input)
          }
          onClose={() => setAddonModal({ open: false, existing: null })}
        />
      )}
    </div>
  )
}
