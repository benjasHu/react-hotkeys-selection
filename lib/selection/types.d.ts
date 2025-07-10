import type { SyntheticEvent } from 'react'
import type { HOTKEYS_SELECTION_STRATEGY } from './constants'

export type HotkeysSelectionStrategy =
  (typeof HOTKEYS_SELECTION_STRATEGY)[keyof typeof HOTKEYS_SELECTION_STRATEGY]

export interface HotkeysSelectionProps<T> {
  initialState: T[]
  strategy: HotkeysSelectionStrategy
  useCtrlKey?: boolean
  useShiftKey?: boolean
}

export interface HotkeysSelectionReturn<T> {
  selected: T[]
  isSelected: (item: T) => boolean
  handleSelection: (event: SyntheticEvent, item: T) => void
  clear: () => void
  add: (items: T[]) => void
  remove: (items: T[]) => void
}

export interface HotkeysSelectionItemReturn {
  isSelected: boolean
  handleSelection: (event: SyntheticEvent) => void
}
