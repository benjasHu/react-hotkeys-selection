import { useCallback, useState, type SyntheticEvent } from 'react'
import { HOTKEYS_SELECTION_STRATEGY } from './constants'
import { useSelection } from './context'
import type {
  HotkeysSelectionItemReturn,
  HotkeysSelectionProps,
  HotkeysSelectionReturn
} from './types'

// Credits to es-toolkit https://github.com/toss/es-toolkit/blob/main/src/array/difference.ts
function difference<T>(firstArr: readonly T[], secondArr: readonly T[]): T[] {
  const secondSet = new Set(secondArr)
  return firstArr.filter((item) => !secondSet.has(item))
}

// Credits to es-toolkit https://github.com/toss/es-toolkit/blob/main/src/array/uniq.ts
function uniq<T>(arr: readonly T[]): T[] {
  return Array.from(new Set(arr))
}

export const useSelectionCore = <T>({
  initialState,
  strategy = HOTKEYS_SELECTION_STRATEGY.SINGLE,
  useCtrlKey = true,
  useShiftKey = true
}: HotkeysSelectionProps<T>): HotkeysSelectionReturn<T> => {
  const [selected, setSelected] = useState<T[]>([])
  const [lastIndividualClick, setLastIndividualClick] = useState<T | null>(null)
  const [lastRangeSelection, setLastRangeSelection] = useState<{
    start: number
    end: number
  } | null>(null)

  const add = useCallback(
    (items: T[]) => {
      setSelected((oldList) => uniq([...oldList, ...items]))
    },
    [setSelected]
  )

  const remove = useCallback(
    (items: T[]) => {
      setSelected((oldList) => difference(oldList, items))
    },
    [setSelected]
  )

  const change = useCallback(
    (addOrRemove: boolean, items: T[]) => {
      if (addOrRemove) {
        add(items)
      } else {
        remove(items)
      }
    },
    [add, remove]
  )

  const clear = useCallback(() => {
    setSelected([])
    setLastIndividualClick(null)
    setLastRangeSelection(null)
  }, [setSelected])

  const isSelected = useCallback((item: T) => selected.includes(item), [selected])

  const handleSelection = useCallback(
    (event: any, item: T) => {
      const isCurrentlySelected = selected.includes(item)

      if (useShiftKey && event.nativeEvent.shiftKey && !!lastIndividualClick) {
        const currentIndex = initialState.findIndex((x) => x === item)
        const lastIndex = initialState.findIndex((x) => x === lastIndividualClick)

        if (currentIndex > -1 && lastIndex > -1) {
          const start = Math.min(currentIndex, lastIndex)
          const end = Math.max(currentIndex, lastIndex)

          if (lastRangeSelection) {
            const oldRangeItems = initialState.slice(
              lastRangeSelection.start,
              lastRangeSelection.end + 1
            )
            change(false, oldRangeItems)
          }

          const rangeItems = initialState.slice(start, end + 1)
          change(true, rangeItems)

          const restingItems = difference(selected, rangeItems)
          change(false, restingItems)

          setLastRangeSelection({ start, end })

          return
        }
      }

      if (useCtrlKey && (event.nativeEvent.ctrlKey || event.nativeEvent.metaKey)) {
        setLastIndividualClick(item)
        setLastRangeSelection(null)

        change(!isCurrentlySelected, [item])

        return
      }

      if (strategy === HOTKEYS_SELECTION_STRATEGY.NONE) {
        return
      }

      setSelected([])
      setLastRangeSelection(null)
      setLastIndividualClick(item)

      change(!isCurrentlySelected, [item])

      if (selected.includes(item)) {
        setSelected([])
        change(true, [item])
      }

      if (
        strategy === HOTKEYS_SELECTION_STRATEGY.TOGGLE &&
        !!lastIndividualClick &&
        isCurrentlySelected &&
        !lastRangeSelection
      ) {
        setSelected([])
        setLastIndividualClick(null)
      }
    },
    [
      change,
      initialState,
      strategy,
      useCtrlKey,
      useShiftKey,
      selected,
      lastIndividualClick,
      setLastIndividualClick,
      lastRangeSelection,
      setLastRangeSelection
    ]
  )

  return {
    selected,
    add,
    remove,
    clear,
    isSelected,
    handleSelection
  }
}

export const useSelectionItem = <T = unknown>(item: T): HotkeysSelectionItemReturn => {
  const { isSelected, handleSelection } = useSelection()

  return {
    isSelected: isSelected(item),
    handleSelection: (event: SyntheticEvent) => handleSelection(event, item)
  }
}
