import { type PropsWithChildren } from 'react'
import { SelectionContext } from './context'
import { useKeyboardSelection, type UseKeyboardSelectionProps } from './hooks'

export const SelectionProvider = ({
  children,
  ...props
}: PropsWithChildren<UseKeyboardSelectionProps<unknown>>) => {
  const selection = useKeyboardSelection(props)

  return <SelectionContext.Provider value={selection}>{children}</SelectionContext.Provider>
}
