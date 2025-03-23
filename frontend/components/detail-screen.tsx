'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { DetailScreenProps } from '@/types';
import { useTextScramble } from '@/hooks/use-text-scramble';
import { DEFAULT_TERMINAL_CONTENT } from '@/constants';
import { useWeb3Store } from '@/store/web3Store';

const getModuleContent = (moduleId: string) => {
  // This could be expanded to pull from a database or API in the future
  const moduleSpecificContent: Record<string, string> = {
    'system-diagnostics': `
SYSTEM DIAGNOSTICS MODULE v2.0.1
--------------------------------
STATUS: READY FOR SCAN

System health metrics:
- CPU: Operational
- Memory: 94% available
- Storage: 82% available
- Network: Connected (750 Mbps)

WARNING: 3 potential vulnerabilities detected
- CVE-2023-0215: Medium severity
- CVE-2022-9876: Low severity
- CVE-2023-1173: Medium severity

Last scan: Never
`,
    'radio-transmitter': `
RADIO TRANSMITTER MODULE v0.8.7
------------------------------
STATUS: INACTIVE (NO SIGNAL)

Available channels:
- Emergency broadcast (locked)
- Local mesh network (available)
- Global broadcast (restricted)

Signal strength: --
Last transmission: Never
Message queue: Empty

NOTICE: This module requires authorization
before full functionality is unlocked.
`,
    'inventory-manager': `
INVENTORY MANAGER MODULE v1.5.3
------------------------------
STATUS: READY

Current inventory:
- Weapons: 0 items
- Apparel: 0 items
- Aid: 0 items
- Misc: 0 items

Storage capacity: 0/250 lbs (0%)
Value: 0 caps

Search functionality ready.
Sort functionality ready.
`,
  };

  return moduleSpecificContent[moduleId] || DEFAULT_TERMINAL_CONTENT;
};

export function DetailScreen({
  state,
  selectedItem,
  isWorkbenchActive = false,
}: DetailScreenProps) {
  const [cursorVisible, setCursorVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const { socialRecoveryAddresses, setSocialRecoveryAddresses } =
    useWeb3Store();

  // Handle address change
  const handleAddressChange = (index: number, value: string) => {
    const newAddresses = [...socialRecoveryAddresses];

    if (value === '') {
      newAddresses[index] = '';
    } else {
      newAddresses[index] = value;
    }

    setSocialRecoveryAddresses(newAddresses);
  };

  const renderSocialRecoveryContent = () => (
    <div className="font-mono text-[#00ff00]">
      <div className="mb-6">
        <h1 className="text-xl mb-1">SOCIAL RECOVERY MODULE v1.2.4</h1>
        <div className="border-b border-[#00ff00] mb-4"></div>
        <p className="mb-2">STATUS: AWAITING CONFIGURATION</p>
      </div>

      <div className="mb-6">
        <p>Welcome to the Social Recovery setup wizard.</p>
        <p>This module enables wallet recovery through trusted contacts.</p>
        <p>Each contact will hold a fragment of your recovery key.</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg mb-4">REQUIRED SETUP:</h2>
        <p className="mb-4">
          Please enter 2 trusted Ethereum addresses that will help you recover
          your wallet if needed.
        </p>

        <div className="space-y-4">
          {[0, 1].map((index) => (
            <div key={index} className="flex flex-col">
              <label className="mb-1 opacity-80">Address {index + 1}:</label>
              <input
                type="text"
                value={socialRecoveryAddresses[index] || ''}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                className="bg-[#001800] border border-[#00ff00] p-2 font-mono text-[#00ff00] w-full focus:outline-none focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00]"
                placeholder="Enter Ethereum address (0x...)"
                spellCheck="false"
                maxLength={42}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Get module-specific content if a module is selected
  const renderContent = () => {
    if (!selectedItem) return null;

    if (selectedItem.id === 'social-recovery') {
      return renderSocialRecoveryContent();
    }

    return (
      <pre className="whitespace-pre-wrap">
        {getModuleContent(selectedItem.id)}
      </pre>
    );
  };

  const isActive = state === 'active' && selectedItem !== null;

  // Use key prop based on selectedItem to force re-render and restart animation
  const scrambleKey = selectedItem ? `module-${selectedItem.id}` : 'no-module';

  // Only use text scramble for non-interactive content
  const useScramble =
    selectedItem?.id !== 'social-recovery' && selectedItem !== null;
  const { displayText } = useTextScramble({
    text: useScramble ? getModuleContent(selectedItem?.id || '') : '',
    isActive: isActive && !isWorkbenchActive && useScramble,
    key: scrambleKey,
  });

  // Blinking cursor effect
  useEffect(() => {
    if (state === 'active') {
      const interval = setInterval(() => {
        setCursorVisible((prev) => !prev);
      }, 530);
      return () => clearInterval(interval);
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
          transition-colors duration-300 ease-in-out
          overflow-hidden
          ${
            state === 'off'
              ? 'bg-gray-900 opacity-70'
              : 'bg-[#001800] opacity-100'
          }
          ${state === 'on' ? 'blur-[3px]' : ''}
        `}
        style={{
          boxShadow:
            state !== 'off' ? 'inset 0 0 15px rgba(0, 255, 0, 0.2)' : 'none',
        }}
      >
        {/* Screen off state */}
        {state === 'off' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-600 font-mono text-2xl tracking-widest crt-pulse">
              <span className="inline-block">S</span>
              <span className="inline-block">C</span>
              <span className="inline-block">R</span>
              <span className="inline-block">E</span>
              <span className="inline-block">E</span>
              <span className="inline-block">N</span>
              <span className="inline-block">&nbsp;</span>
              <span className="inline-block">O</span>
              <span className="inline-block">F</span>
              <span className="inline-block">F</span>
            </div>
          </div>
        )}

        {/* Screen on without content state */}
        {state === 'on' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[#00ff00] font-mono text-xl tracking-widest">
              SCREEN ON WITHOUT CONTENT
            </div>
          </div>
        )}

        {/* Active terminal state */}
        {state === 'active' && (
          <div
            ref={contentRef}
            className="p-4 font-mono text-sm text-[#00ff00] h-full overflow-auto scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black"
          >
            {selectedItem ? (
              isWorkbenchActive ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="text-[#00ff00] font-mono text-xl tracking-widest mb-4">
                    WORKBENCH MODE
                  </div>
                  <div className="text-[#00ff00] font-mono text-md opacity-70 mb-8">
                    Configuring: {selectedItem.name}
                  </div>
                  <div className="w-16 h-16 border-2 border-[#00ff00] rounded-full flex items-center justify-center animate-pulse">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </div>
                </div>
              ) : selectedItem?.id === 'social-recovery' ? (
                renderContent()
              ) : (
                <pre key={scrambleKey} className="whitespace-pre-wrap">
                  {displayText}
                  {cursorVisible ? '█' : ' '}
                </pre>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="text-[#00ff00] font-mono text-xl tracking-widest mb-4">
                  NO MODULE SELECTED
                </div>
                <div className="text-[#00ff00] font-mono text-sm opacity-70 mb-2 text-center max-w-md">
                  Select a module from the left panel to view details.
                </div>
                <div className="text-[#00ff00] font-mono text-xs opacity-50 text-center max-w-md">
                  You can click a selected module again to deselect it.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scan line effect - more pronounced */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0)_100%)] bg-[length:100%_2px]"></div>
        </div>

        {/* CRT flicker effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-green-900 animate-[flicker_5s_infinite]"></div>
      </div>

      {/* Glass reflection */}
      <div className="absolute inset-2 rounded bg-gradient-to-br from-white to-transparent opacity-5 pointer-events-none"></div>
    </div>
  );
}
