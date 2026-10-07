import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import FlightLiveStatus from '@/components/itineraries/FlightLiveStatus'
import * as S from './FlightItem.styled'
import { COPY } from './FlightItem.constants'
import { endpoint, flightMeta } from './FlightItem.utils'
import type { FlightItemProps } from './FlightItem.types'

/** One confirmed flight in the Trip tab, with its live status. */
export default function FlightItem({ flight, showLiveStatus, onEdit, onDelete }: FlightItemProps) {
  const meta = flightMeta(flight)

  return (
    <S.FlightRow>
      <div>
        <S.FlightCode>{flight.flightNumber}</S.FlightCode>
        <S.FlightAirline>{flight.airline}</S.FlightAirline>
      </div>
      <div>
        <S.Route>
          {flight.departureAirport} → {flight.arrivalAirport}
        </S.Route>
        <S.Times>
          {endpoint(flight.departsLocal, flight.departsZone, COPY.departureTbc)}
          {' · '}
          {endpoint(flight.arrivesLocal, flight.arrivesZone, COPY.arrivalTbc)}
        </S.Times>
        {meta && <S.Meta>{meta}</S.Meta>}
        {showLiveStatus && flight.confirmedByOperator && (
          <FlightLiveStatus flight={flight} audience="operator" />
        )}
      </div>
      <S.RowActions>
        <ActionButton $variant="ghost" onClick={onEdit}>
          {COPY.edit}
        </ActionButton>
        <ActionButton $variant="ghost" onClick={onDelete}>
          {COPY.delete}
        </ActionButton>
      </S.RowActions>
    </S.FlightRow>
  )
}
