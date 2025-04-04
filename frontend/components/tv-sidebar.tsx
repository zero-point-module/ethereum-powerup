import { CircularDisplay } from './circular-display';
import { ModuleSelector } from './module-selector';
import { TVControls } from './tv-controls';
import type { Item, TVState } from '@/types';

interface TVSidebarProps {
  state: TVState;
  items: Item[];
  selectedItem: Item | null;
  isWorkbenchActive: boolean;
  onSelectItem: (item: Item) => void;
  onTurnOn: () => void;
  onActivate: () => void;
  onWorkbenchToggle: () => void;
}

export function TVSidebar({
  state,
  items,
  selectedItem,
  isWorkbenchActive,
  onSelectItem,
  onTurnOn,
  onActivate,
  onWorkbenchToggle,
}: TVSidebarProps) {
  return (
    <div className="w-1/3 p-4 flex flex-col items-center justify-between">
      <CircularDisplay state={state} />

      <ModuleSelector
        items={items}
        state={state}
        selectedItem={selectedItem}
        onSelectItem={onSelectItem}
      />

      <TVControls
        state={state}
        selectedItem={selectedItem}
        isWorkbenchActive={isWorkbenchActive}
        onTurnOn={onTurnOn}
        onActivate={onActivate}
        onWorkbenchToggle={onWorkbenchToggle}
      />
    </div>
  );
}
