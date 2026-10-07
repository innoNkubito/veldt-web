/** Traveller contact and trip dates, as strings for controlled inputs ("" = unset). */
export interface TravellerForm {
  clientEmail: string
  clientPhone: string
  startDate: string // YYYY-MM-DD
  endDate: string
}
