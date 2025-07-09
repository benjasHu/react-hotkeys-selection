import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '../utils'
import { useSelection } from './context'
import { type UseKeyboardSelectionProps, useSelectionItem } from './hooks'
import { MOCK_DATA, MOCK_GRID_DATA } from './mock'
import { SelectionProvider } from './provider'

const meta = {
  title: 'Components/Selection',
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    selectItemsOnClick: {
      control: { type: 'boolean' }
    }
  },
  decorators: [
    (Story, { context }) => {
      const mock = useMemo(() => {
        if (context.name === 'Grid') {
          return MOCK_GRID_DATA
        } else {
          return MOCK_DATA
        }
      }, [context])

      return (
        <SelectionProvider
          initialState={context.args.initialState || mock}
          selectItemsOnClick={context.args.selectItemsOnClick}
        >
          <Story {...context} />
        </SelectionProvider>
      )
    }
  ]
} satisfies Meta<UseKeyboardSelectionProps<IListItem>>

export default meta

type Story = StoryObj<UseKeyboardSelectionProps<IListItem>>

interface IListItem {
  id: string
  title: string
}

interface ListItemProps {
  item: IListItem
  className?: string
}

const ListItem = ({ item, className }: ListItemProps) => {
  const { isSelected, onClick } = useSelectionItem(item)

  return (
    <div
      onClick={onClick}
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
  args: {
    selectItemsOnClick: true,
    initialState: MOCK_DATA
  }
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
    selectItemsOnClick: true,
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
  args: {
    selectItemsOnClick: true,
    initialState: MOCK_DATA
  }
}
