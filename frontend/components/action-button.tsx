"use client"

import { useState } from "react"
import type { ActionButtonProps } from "@/types"

export function ActionButton({ label, onClick, disabled = false, className = "", tvState = "off" }: ActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true)
    }
  }

  const handleMouseUp = () => {
    if (!disabled) {
      setIsPressed(false)
      onClick()
    }
  }

  const handleMouseLeave = () => {
    setIsPressed(false)
    setIsHovered(false)
  }

  // Special styling for the "POWER UP" button
  const isPowerUpButton = label.includes("POWER UP")

  return (
    <div className="w-full relative h-12">
      {/* Button base/shadow */}
      <div className="absolute inset-0 rounded-md bg-gray-900 transform translate-y-1"></div>

      {/* Button body */}
      <button
        className={`
          absolute inset-0 rounded-md border-2 font-mono text-center
          transition-all duration-300 ease-in-out tracking-wider
          ${
            isPressed && !disabled
              ? "bg-gray-800 text-[#00ff00] transform translate-y-1 shadow-none"
              : "bg-gradient-to-b from-gray-700 to-gray-800 text-[#00ff00] shadow-lg"
          }
          ${isHovered && !isPressed && !disabled ? "from-gray-600 to-gray-700" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed border-gray-800" : "cursor-pointer"}
          ${isPowerUpButton ? "unified-glow" : "border-gray-800"}
          ${tvState === "on" && !isPowerUpButton ? "blur-[2px]" : ""}
          focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
          ${className}
        `}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
      >
        {isPowerUpButton ? (
          <div className="flex items-center justify-center">
            <span className="font-bold">POWER UP</span>
            <span className="arrow-bounce font-bold inline-flex items-center justify-center ml-1 relative top-[-1px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </span>
          </div>
        ) : (
          <span>{label}</span>
        )}
      </button>
    </div>
  )
}

