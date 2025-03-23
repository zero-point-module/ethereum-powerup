import { CircularDisplay } from './circular-display';
import { ModuleSelector } from './module-selector';
import { TVControls } from './tv-controls';
import type { Item, TVState } from '@/types';

interface TVSidebarProps {
  state: TVState;
  items: Item[];
  selectedItem: Item | null;
  isWorkbenchActive: boolean;
  isModuleInstalled: (moduleId: number) => boolean;
  onSelectItem: (item: Item) => void;
  onTurnOn: () => void;
  onActivate: () => void;
  onInstall: () => void;
  onUninstall: () => void;
  onWorkbenchToggle: () => void;
}

export function TVSidebar({
  state,
  items,
  selectedItem,
  isWorkbenchActive,
  isModuleInstalled,
  onSelectItem,
  onTurnOn,
  onActivate,
  onInstall,
  onUninstall,
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
        isModuleInstalled={isModuleInstalled}
        onTurnOn={onTurnOn}
        onActivate={onActivate}
        onInstall={onInstall}
        onUninstall={onUninstall}
        onWorkbenchToggle={onWorkbenchToggle}
      />
    </div>
  );
}
