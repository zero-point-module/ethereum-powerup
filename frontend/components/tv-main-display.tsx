import { DetailScreen } from './detail-screen';
import type { Item, TVState } from '@/types';

interface TVMainDisplayProps {
  state: TVState;
  selectedItem: Item | null;
  isWorkbenchActive: boolean;
}

export function TVMainDisplay({
  state,
  selectedItem,
  isWorkbenchActive,
}: TVMainDisplayProps) {
  return (
    <div className="w-2/3 p-4 h-full">
      <DetailScreen
        state={state}
        selectedItem={selectedItem}
        isWorkbenchActive={isWorkbenchActive}
      />
    </div>
  );
}
