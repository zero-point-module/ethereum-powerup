# State Management with Zustand

This application uses [Zustand](https://github.com/pmndrs/zustand) for state management, a small, fast and scalable state-management solution.

## Store Structure

We have two main stores:

### 1. TV Store (`tv-store.ts`)

Manages the state of the vintage TV interface:

- **State:**

  - `state`: Current TV state ('off', 'on', 'active')
  - `selectedItem`: Currently selected module

- **Actions:**
  - `turnOn()`: Powers on the TV
  - `turnOff()`: Powers off the TV
  - `activate()`: Activates the TV (from 'on' to 'active')
  - `togglePower()`: Toggles between 'off' and the previous state
  - `selectItem(item)`: Selects a module item when the TV is active

### 2. Modules Store (`modules-store.ts`)

Manages the installed modules with persistence to localStorage:

- **State:**

  - `installedModules`: Array of installed module IDs

- **Actions:**
  - `installModule(moduleId)`: Installs a module
  - `uninstallModule(moduleId)`: Uninstalls a module
  - `isModuleInstalled(moduleId)`: Checks if a module is installed
  - `clearAllModules()`: Clears all installed modules

## Usage Example

```tsx
// In a component
import { useTVStore } from '@/store/tv-store';
import { useModulesStore } from '@/store/modules-store';

function MyComponent() {
  // Access TV store
  const { state, selectedItem, turnOn } = useTVStore();

  // Access modules store
  const { isModuleInstalled, installModule } = useModulesStore();

  // Use the state and actions
  return (
    <div>
      <button onClick={turnOn}>Turn On</button>
      {state === 'active' && (
        <div>
          {isModuleInstalled(1)
            ? 'Module 1 is installed'
            : 'Module 1 is not installed'}
          <button onClick={() => installModule(1)}>Install Module 1</button>
        </div>
      )}
    </div>
  );
}
```

## Benefits of this Implementation

1. **Simplified Component Tree**: No need for context providers wrapping the application
2. **Easier Testing**: Stores can be easily mocked and tested in isolation
3. **Persistent State**: Built-in persistence with the Zustand persist middleware
4. **Reduced Boilerplate**: Less code compared to React Context API
5. **Improved Developer Experience**: More intuitive API for accessing and updating state
6. **TypeScript Support**: Full type safety with TypeScript
7. **Optimized Rendering**: Only components that use specific parts of the state re-render
