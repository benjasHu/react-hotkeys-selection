# React Hotkeys Selection

A React library for handling multi-item selection with full keyboard shortcuts and mouse gestures support, similar to native OS experiences.
Use it on:

- ✅ Tables with checkboxes where you need to select rows, such as in GMail.
- ✅ Image galleries
- ✅ Lists of folders or files
- ✅ In any list of items that need selection!

## Demo

[Storybook Demo](https://benjashu.github.io/react-hotkeys-selection)

## Features

- ✅ **Multi-selection**: Support for selecting multiple items
- ⌨️ **Keyboard shortcuts**: Ctrl/Cmd+Click for individual selection, Shift+Click for ranges
- 🖱️ **Selection strategy**: Individual selection, toggle selection, or no selection
- 🎯 **TypeScript**: Fully typed with generic support
- 🔧 **Flexible**: Configurable selection behaviors and event handlers in your items
- 🚀 **Optimized**: Uses memoized callbacks for better performance

## Installation

Install with [pnpm](https://pnpm.io/) or your preferred package manager:

```bash
pnpm add react-hotkeys-selection
```

## Quick Start

### 1. Setup Provider

```tsx
import { SelectionProvider } from 'react-hotkeys-selection'

const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
]

function App() {
  return (
    <SelectionProvider initialState={items}>
      <ItemList />
    </SelectionProvider>
  )
}
```

### 2. Use in Components

```tsx
import { useSelection, useSelectionItem } from 'react-hotkeys-selection'

function ItemList() {
  const { selected, clear } = useSelection()

  return (
    <div>
      <button onClick={clear}>Clear ({selected.length})</button>
      {items.map((item) => (
        <Item
          key={item.id}
          item={item}
        />
      ))}
    </div>
  )
}

function Item({ item }) {
  const { isSelected, handleSelection } = useSelectionItem(item)

  return (
    <div
      onClick={handleSelection}
      style={{
        backgroundColor: isSelected ? '#e3f2fd' : 'white',
        padding: '8px',
        cursor: 'pointer'
      }}
    >
      {item.name}
    </div>
  )
}
```

## API Reference

### `SelectionProvider`

Provides selection context to child components.

**Props:** `HotkeysSelectionProps<T>`

- `initialState: T[]` - Array of selectable items
- `strategy?: HotkeysSelectionStrategy` - Individual selection `'single'`, toggle selection `'toggle'`, or no selection `'none'` (default: `'single'`)
- `useCtrlKey?: boolean` - Enable Ctrl/Cmd+Event for individual selection (default: `true`)
- `useShiftKey?: boolean` - Enable Shift+Event for range selection (default: `true`)

### `useSelection<T>()`

Main hook providing selection functionality.

**Returns:** `HotkeysSelectionReturn<T>`

| Property          | Type                                       | Description                 |
| ----------------- | ------------------------------------------ | --------------------------- |
| `selected`        | `T[]`                                      | Currently selected items    |
| `isSelected`      | `(item: T) => boolean`                     | Check if item is selected   |
| `handleSelection` | `(event: SyntheticEvent, item: T) => void` | Event handler for items     |
| `clear`           | `() => void`                               | Clear all selection         |
| `add`             | `(items: T[]) => void`                     | Add items to selection      |
| `remove`          | `(items: T[]) => void`                     | Remove items from selection |

### `useSelectionItem<T>(item: T)`

Convenience hook for individual item components.

**Returns:** `HotkeysSelectionItemReturn<T>`
| Property | Type | Description |
|----------|------|-------------|
| `isSelected` | `boolean` | Whether this item is selected |
| `handleSelection` | `(event: SyntheticEvent) => void` | Pre-configured event handler |

### `useSelectionCore<T>(props)`

Low-level hook that can be used without the provider. Requires manual prop drilling to child components.

**Props:** `HotkeysSelectionProps<T>`

**Returns:** `HotkeysSelectionReturn<T>`

> **Note**: When using `useSelectionCore` directly, you cannot use `useSelectionItem` as it requires the context provider. You'll need to pass the selection state manually to child components.

## Selection Behaviors

| Interaction          | Behavior                                     |
| -------------------- | -------------------------------------------- |
| **Event**            | Selection by predefined strategy             |
| **Ctrl/Cmd + Event** | Toggle clicked item without affecting others |
| **Shift + Event**    | Select range from last individual item       |

## Advanced Usage

### Programmatic Selection

```tsx
function Controls() {
  const { selected, add, remove, clear } = useSelection()

  const selectAll = () => add(items)
  const selectEvens = () => add(items.filter((_, i) => i % 2 === 0))

  return (
    <div>
      <button onClick={selectAll}>Select All</button>
      <button onClick={selectEvens}>Select Evens</button>
      <button onClick={clear}>Clear</button>
    </div>
  )
}
```

### With TypeScript

```tsx
interface User {
  id: number
  name: string
  email: string
}

function UserList() {
  const users: User[] = [
    /* ... */
  ]

  return (
    <SelectionProvider<User> initialState={users}>
      <UserTable />
    </SelectionProvider>
  )
}

function UserTable() {
  const { selected } = useSelection<User>()
  // selected is properly typed as User[]
}
```

### Using useSelectionCore Directly

```tsx
function DirectUsage() {
  const items = [
    /* ... */
  ]
  const selection = useSelectionCore({ initialState: items })

  return (
    <div>
      <button onClick={selection.clear}>Clear</button>
      {items.map((item) => (
        <Item
          key={item.id}
          item={item}
          selection={selection} // Manual prop drilling required
        />
      ))}
    </div>
  )
}

function Item({ item, selection }) {
  return (
    <div
      onClick={(e) => selection.handleSelection(e, item)}
      style={{
        backgroundColor: selection.isSelected(item) ? '#e3f2fd' : 'white'
      }}
    >
      {item.name}
    </div>
  )
}
```

## Storybook Examples

This library includes comprehensive Storybook examples:

- **Basic**: Simple list selection
- **Grid**: Grid layout with selection
- **WithControls**: Advanced controls and programmatic selection

## Performance

- Immutable state updates for React compatibility

## Requirements

- React 16.8+
- TypeScript 4.5+

## License

MIT © [Benja Osuna](https://github.com/benjasHu)
