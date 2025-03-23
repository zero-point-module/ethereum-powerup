import { ListDisplay } from './list-display';
import type { Item, TVState } from '@/types';

interface ModuleSelectorProps {
  items: Item[];
  state: TVState;
  selectedItem: Item | null;
  onSelectItem: (item: Item) => void;
}

export function ModuleSelector({
  items,
  state,
  selectedItem,
  onSelectItem,
}: ModuleSelectorProps) {
  return (
    <div className="my-4 w-full h-64">
      <ListDisplay
        items={items}
        state={state}
        selectedItem={selectedItem}
        onSelectItem={onSelectItem}
      />
    </div>
  );
}
