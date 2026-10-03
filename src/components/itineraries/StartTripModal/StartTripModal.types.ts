export interface StartTripModalProps {
  /** Where the "dashboard ready" email goes; null hides the email option. */
  travellerEmail: string | null
  /** Resolves to an error message, or null once the trip has started. */
  onConfirm: (notifyTraveller: boolean) => Promise<string | null>
  onCancel: () => void
}
