import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import { cn } from '../utils'
import { HOTKEYS_SELECTION_STRATEGY } from './constants'
import { useSelection } from './context'
import { useSelectionItem } from './hooks'
import { MOCK_DATA, MOCK_GRID_DATA } from './mock'
import { SelectionProvider } from './provider'
import { HotkeysSelectionProps } from './types'

const meta = {
  title: 'Components/Selection',
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    strategy: {
      options: Object.values(HOTKEYS_SELECTION_STRATEGY),
      control: { type: 'select' }
    },
    useCtrlKey: {
      control: { type: 'boolean' }
    },
    useShiftKey: {
      control: { type: 'boolean' }
    }
  },
  decorators: [
    (Story, { context }) => {
      return (
        <SelectionProvider {...context.args}>
          <Story {...context} />
        </SelectionProvider>
      )
    }
  ]
} satisfies Meta<HotkeysSelectionProps<IListItem>>

export default meta

type Story = StoryObj<HotkeysSelectionProps<IListItem>>

interface IListItem {
  id: string
  title: string
}

interface ListItemProps {
  item: IListItem
  className?: string
}

const ListItem = ({ item, className }: ListItemProps) => {
  const { isSelected, handleSelection } = useSelectionItem(item)

  return (
    <div
      onClick={handleSelection}
      className={cn(
        'w-full h-10 bg-gray-200 rounded-md flex items-center justify-center text-sm cursor-pointer transition-all select-none font-bold text-gray-700',
        className,
        !isSelected && 'hover:bg-gray-300',
        isSelected && 'bg-indigo-500 text-white'
      )}
    >
      <span>{item.title}</span>
    </div>
  )
}

const BASE_STORIES_CONFIG = {
  strategy: HOTKEYS_SELECTION_STRATEGY.SINGLE,
  useCtrlKey: true,
  useShiftKey: true,
  initialState: MOCK_DATA
}

export const Basic: Story = {
  render: ({ initialState }) => {
    return (
      <div className="w-[400px] flex flex-col gap-2">
        {initialState.map((item) => (
          <ListItem
            key={item.id}
            item={item}
          />
        ))}
      </div>
    )
  },
  args: BASE_STORIES_CONFIG
}

export const Grid: Story = {
  render: ({ initialState }) => {
    return (
      <div className="grid grid-cols-5 gap-2">
        {initialState.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            className="aspect-square h-[90px]"
          />
        ))}
      </div>
    )
  },
  args: {
    ...BASE_STORIES_CONFIG,
    initialState: MOCK_GRID_DATA
  }
}

export const WithControls: Story = {
  render: ({ initialState }) => {
    const { selected, clear, add } = useSelection<IListItem>()
    const [selectedItems, setSelectedItems] = useState(selected)

    const hasSelecteds = selectedItems.length > 0

    useEffect(() => {
      setSelectedItems(selected)
    }, [selected, setSelectedItems])

    return (
      <div>
        <div className="mb-4 flex gap-2 justify-center">
          <button
            onClick={() => clear()}
            className={cn(
              'text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white border-none rounded cursor-pointer transition-colors',
              !hasSelecteds && 'opacity-50 pointer-events-none'
            )}
          >
            Clear Selection ({selectedItems.length})
          </button>
          <button
            onClick={() => add(initialState)}
            className="text-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white border-none rounded cursor-pointer transition-colors"
          >
            Select All
          </button>
        </div>
        <div className="w-[400px] flex flex-col gap-2">
          {initialState.map((item) => (
            <ListItem
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </div>
    )
  },
  args: BASE_STORIES_CONFIG
}
