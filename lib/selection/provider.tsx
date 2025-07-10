import { type PropsWithChildren } from 'react'
import { SelectionContext } from './context'
import { useSelectionCore } from './hooks'
import type { HotkeysSelectionProps } from './types'

export const SelectionProvider = ({
  children,
  ...props
}: PropsWithChildren<HotkeysSelectionProps<unknown>>) => {
  const selection = useSelectionCore(props)

  return <SelectionContext.Provider value={selection}>{children}</SelectionContext.Provider>
}
