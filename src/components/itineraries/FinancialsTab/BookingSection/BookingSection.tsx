'use client'

import { useRouter } from 'next/navigation'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import BookingSetupChecklist from './BookingSetupChecklist'
import AddonsCard from './cards/AddonsCard'
import CardPaymentsCard from './cards/CardPaymentsCard'
import ModeCard from './cards/ModeCard'
import PackagesCard from './cards/PackagesCard'
import RemindersCard from './cards/RemindersCard'
import ScheduleCard from './cards/ScheduleCard'
import SettingsCard from './cards/SettingsCard'
import { useBookingSection } from './useBookingSection'
import * as S from './BookingSection.styled'

/**
 * How the client books and pays: off, an external link, or through Veldt
 * with packages, add-ons, a payment schedule and reminders.
 */
export default function BookingSection() {
  const router = useRouter()
  const b = useBookingSection()

  if (b.loading) return <S.LoadingMessage>Loading booking settings...</S.LoadingMessage>

  return (
    <div>
      {b.error && <S.ErrorBanner onClick={b.clearError}>{b.error}</S.ErrorBanner>}

      <ModeCard form={b.form} setF={b.setF} />

      {b.needsProcessor && (
        <S.Callout $tone="warn">
          No payment processor is connected yet — booking through Veldt needs one.{' '}
          {b.isOwner ? (
            <S.CalloutLink onClick={() => router.push('/integrations')}>Go to Integrations</S.CalloutLink>
          ) : (
            'Ask your account owner to connect one on the Integrations page.'
          )}
        </S.Callout>
      )}

      {b.showVeldtSections && (
        <>
          <BookingSetupChecklist steps={b.steps} />
          <PackagesCard
            config={b.config}
            currency={b.currency}
            saving={b.saving}
            quotePackage={b.quotePackage}
            onAdded={b.promptNextStep}
          />
          <AddonsCard config={b.config} currency={b.currency} saving={b.saving} />
          <SettingsCard
            form={b.form}
            setF={b.setF}
            currency={b.currency}
            activeConnections={b.activeConnections}
            selectedConnection={b.selectedConnection}
          />
          <ScheduleCard config={b.config} currency={b.currency} saving={b.saving} isTemplate={b.isTemplate} />
          <CardPaymentsCard
            form={b.form}
            setF={b.setF}
            selectedConnection={b.selectedConnection}
            processorName={b.processorName}
          />
          <RemindersCard form={b.form} setF={b.setF} />
        </>
      )}

      <S.SaveBar>
        {b.dirty && <S.DirtyNote>You have unsaved changes</S.DirtyNote>}
        <ActionButton
          $variant="primary"
          $disabled={b.saving || !b.dirty}
          onClick={() => b.dirty && !b.saving && b.saveSettings()}
        >
          {b.saving ? 'Saving…' : 'Save Booking Settings'}
        </ActionButton>
      </S.SaveBar>
    </div>
  )
}
