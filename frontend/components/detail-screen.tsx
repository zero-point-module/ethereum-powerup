'use client';

import { useState, useRef, useEffect } from 'react';
import type { DetailScreenProps } from '@/types';
import { useTextScramble } from '@/hooks/use-text-scramble';
import { DEFAULT_TERMINAL_CONTENT } from '@/constants';

export function DetailScreen({
  state,
  selectedItem,
  isWorkbenchActive = false,
}: DetailScreenProps) {
  const [cursorVisible, setCursorVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const isActive = state === 'active' && selectedItem !== null;
  const { displayText, scrambling } = useTextScramble({
    text: DEFAULT_TERMINAL_CONTENT,
    isActive: isActive && !isWorkbenchActive,
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
                    Configuring: {selectedItem.title}
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
              ) : (
                <pre className="whitespace-pre-wrap">
                  {displayText}
                  {cursorVisible ? '█' : ' '}
                </pre>
              )
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-[#00ff00] font-mono text-xl tracking-widest">
                  SELECT AN ITEM
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
