import { createContext, useContext } from 'react'
import { type UseKeyboardSelectionReturn } from './hooks'

export const SelectionContext = createContext<UseKeyboardSelectionReturn<unknown>>(null!)

export const useSelection = <T = unknown>() => {
  const context = useContext(SelectionContext)

  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider')
  }

  return context as UseKeyboardSelectionReturn<T>
}
