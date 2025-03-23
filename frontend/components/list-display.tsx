'use client';

import { useState, useCallback, memo } from 'react';
import type { ListDisplayProps } from '@/types';
import { useModulesStore } from '@/store/modules-store';

// Create the component function
function ListDisplayComponent({
  items,
  state,
  selectedItem,
  onSelectItem,
}: ListDisplayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyInstalled, setShowOnlyInstalled] = useState(false);
  const { isModuleInstalled } = useModulesStore();

  // Filter items based on search query and installation status
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesInstalled = !showOnlyInstalled || isModuleInstalled(item.id);
    return matchesSearch && matchesInstalled;
  });

  // Clear search query
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Toggle installed filter
  const toggleInstalledFilter = useCallback(() => {
    if (state === 'active') {
      setShowOnlyInstalled((prev) => !prev);
    }
  }, [state]);

  return (
    <div className="w-full h-full relative">
      {/* Display frame */}
      <div className="absolute inset-0 rounded-md border-4 border-gray-800 bg-gray-900 shadow-inner"></div>

      {/* Screen background - more authentic green with transition */}
      <div
        className={`
          absolute inset-1 rounded 
          transition-all duration-300 ease-in-out
          overflow-hidden
          ${
            state === 'off'
              ? 'bg-gray-900 scale-95 opacity-70'
              : 'bg-[#001800] scale-100 opacity-100'
          }
          ${state === 'on' ? 'blur-[3px]' : ''}
        `}
        style={{
          boxShadow:
            state !== 'off' ? 'inset 0 0 10px rgba(0, 255, 0, 0.3)' : 'none',
        }}
      >
        {/* No signal state */}
        {state === 'off' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-600 font-mono text-xl tracking-widest">
              NO SIGNAL
            </div>
          </div>
        )}

        {/* List items */}
        {(state === 'on' || state === 'active') && (
          <div className="p-2 space-y-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {/* Filter and Search bar */}
            <div className="mb-3 flex space-x-2 items-center">
              {/* Search bar - now on the left and taking most space */}
              <div className="flex-1 border border-[#004000] rounded bg-[#001200] p-1 flex items-center">
                <span className="text-[#00ff00] opacity-70 mr-1 text-xs">
                  {'>'}
                </span>
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[#00ff00] font-mono text-sm placeholder-[#00aa00] placeholder-opacity-50 focus:ring-0"
                  disabled={state !== 'active'}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="text-[#00ff00] opacity-70 hover:opacity-100 text-xs px-1"
                    disabled={state !== 'active'}
                  >
                    X
                  </button>
                )}
              </div>

              {/* Filter button - now on the right with just an icon */}
              <button
                onClick={toggleInstalledFilter}
                className={`
                  border border-[#004000] rounded bg-[#001200] p-1 w-8 h-8 flex items-center justify-center
                  transition-colors duration-200
                  ${showOnlyInstalled ? 'bg-[#003000] border-[#00ff00]' : ''}
                  ${
                    state !== 'active'
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-[#002800] cursor-pointer'
                  }
                `}
                title={
                  showOnlyInstalled
                    ? 'Show all modules'
                    : 'Show installed modules only'
                }
                disabled={state !== 'active'}
              >
                <span className="text-[#00ff00] font-mono text-xs">
                  {showOnlyInstalled ? '✓' : '⚙'}
                </span>
              </button>
            </div>

            {/* Filtered items */}
            {filteredItems.map((item) => (
              <ListItem
                key={item.id}
                item={item}
                state={state}
                isSelected={selectedItem?.id === item.id}
                isInstalled={isModuleInstalled(item.id)}
                onSelect={() => state === 'active' && onSelectItem(item)}
              />
            ))}

            {/* No results message */}
            {filteredItems.length === 0 && (
              <div className="text-[#00ff00] opacity-50 text-center py-4 font-mono text-sm">
                NO MATCHING RECORDS FOUND
              </div>
            )}
          </div>
        )}

        {/* Scan line effect - more pronounced */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0)_100%)] bg-[length:100%_2px]"></div>
        </div>
      </div>

      {/* Glass reflection */}
      <div className="absolute inset-2 rounded bg-gradient-to-br from-white to-transparent opacity-5 pointer-events-none"></div>
    </div>
  );
}

// Memoized list item component to prevent unnecessary re-renders
interface ListItemProps {
  item: { id: number; title: string };
  state: 'off' | 'on' | 'active';
  isSelected: boolean;
  isInstalled: boolean;
  onSelect: () => void;
}

const ListItem = memo(function ListItem({
  item,
  state,
  isSelected,
  isInstalled,
  onSelect,
}: ListItemProps) {
  return (
    <div
      className={`
        p-2 rounded border border-l-4 flex items-center justify-between
        transition-all duration-200 transform
        h-10 min-h-[40px] relative overflow-visible
        ${
          state === 'active'
            ? 'cursor-pointer hover:scale-[1.02]'
            : 'cursor-not-allowed opacity-70'
        }
        ${
          isSelected
            ? 'bg-[#003000] border-[#00ff00] shadow-[0_0_12px_rgba(0,255,0,0.5)] translate-x-1'
            : 'bg-[#001800] border-[#004000] hover:bg-[#002800] hover:border-l-[#008800]'
        }
        ${isInstalled ? 'border-r-[#00ff00] border-r-4' : ''}
      `}
      onClick={onSelect}
      title={isSelected ? 'Click to deselect' : item.title}
    >
      {/* Installation indicator - positioned absolutely to avoid affecting layout */}
      {isInstalled && (
        <div className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#00ff00] rounded-full flex items-center justify-center text-black text-xs font-bold z-10">
          ✓
        </div>
      )}

      <span
        className={`text-[#00ff00] font-mono text-sm truncate max-w-[85%] ${
          isSelected ? 'animate-pulse' : ''
        }`}
      >
        {isSelected ? '> ' : ''}
        {item.title}{' '}
        {isSelected && (
          <span className="text-xs ml-1 opacity-70">[click to deselect]</span>
        )}
      </span>

      {/* Status indicator - visual only, no text */}
      <span
        className={`text-[#00ff00] text-xs ml-2 w-8 text-right ${
          !isInstalled && 'opacity-0'
        }`}
      >
        {isInstalled ? '✓' : ''}
      </span>
    </div>
  );
});

// Export as both default and named export
export default ListDisplayComponent;
export { ListDisplayComponent as ListDisplay };
