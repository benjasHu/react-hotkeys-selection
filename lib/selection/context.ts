import { createContext, useContext } from 'react'
import type { HotkeysSelectionReturn } from './types'

export const SelectionContext = createContext<HotkeysSelectionReturn<unknown>>(null!)

export const useSelection = <T = unknown>() => {
  const context = useContext(SelectionContext)

  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider')
  }

  return context as HotkeysSelectionReturn<T>
}
