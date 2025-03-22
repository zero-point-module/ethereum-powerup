"use client"

import { useState, useRef, useEffect } from "react"
import type { DetailScreenProps } from "@/types"
import { useTextScramble } from "@/hooks/use-text-scramble"
import { DEFAULT_TERMINAL_CONTENT } from "@/constants"

export function DetailScreen({ state, selectedItem }: DetailScreenProps) {
  const [cursorVisible, setCursorVisible] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  const isActive = state === "active" && selectedItem !== null
  const { displayText, scrambling } = useTextScramble({
    text: DEFAULT_TERMINAL_CONTENT,
    isActive,
  })

  // Blinking cursor effect
  useEffect(() => {
    if (state === "active") {
      const interval = setInterval(() => {
        setCursorVisible((prev) => !prev)
      }, 530)
      return () => clearInterval(interval)
    }
  }, [state])

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
          ${state === "off" ? "bg-gray-900 scale-95 opacity-70" : "bg-[#001800] scale-100 opacity-100"}
          ${state === "on" ? "blur-[3px]" : ""}
        `}
        style={{
          boxShadow: state !== "off" ? "inset 0 0 15px rgba(0, 255, 0, 0.2)" : "none",
        }}
      >
        {/* Screen off state */}
        {state === "off" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-600 font-mono text-2xl tracking-widest">SCREEN OFF</div>
          </div>
        )}

        {/* Screen on without content state */}
        {state === "on" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[#00ff00] font-mono text-xl tracking-widest">SCREEN ON WITHOUT CONTENT</div>
          </div>
        )}

        {/* Active terminal state */}
        {state === "active" && (
          <div
            ref={contentRef}
            className="p-4 font-mono text-sm text-[#00ff00] h-full overflow-auto scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black"
          >
            {selectedItem ? (
              <pre className="whitespace-pre-wrap">
                {displayText}
                {cursorVisible ? "█" : " "}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-[#00ff00] font-mono text-xl tracking-widest">SELECT AN ITEM</div>
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
  )
}

