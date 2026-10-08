import { useEffect, useState } from 'react'
import { useClientStore } from '@/stores/clientStore'
import { useBrandStore } from '@/stores/brandStore'
import { confirmDialog } from '@/stores/confirmStore'
import { logoFileError } from '@/lib/logo'
import { CONFIRM_LOGO_DIALOG } from './OperatorBrandCard.constants'

/** Loads the brand and lets the owner set the logo — once. */
export function useOperatorBrandCard() {
  const client = useClientStore((s) => s.client)
  const { brand, saving, fetchBrand, setLogo } = useBrandStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (client) fetchBrand()
  }, [client, fetchBrand])

  async function chooseFile(file: File | undefined) {
    if (!file) return
    const problem = logoFileError(file)
    if (problem) {
      setError(problem)
      return
    }
    setError(null)
    if (!(await confirmDialog(CONFIRM_LOGO_DIALOG))) return
    setError(await setLogo(file))
  }

  return { brand, saving, error, chooseFile }
}
