'use client';

import { useState } from 'react';
import { BaseButton, BaseButtonProps } from './BaseButton';

interface PowerUpButtonProps extends Omit<BaseButtonProps, 'label'> {
  // No additional props needed
}

export function PowerUpButton({
  onClick,
  disabled = false,
  className = '',
  isLoading = false,
  tvState,
}: PowerUpButtonProps) {
  // Return a basic button when loading
  if (isLoading) {
    return (
      <BaseButton
        label="POWERING UP"
        onClick={() => {}}
        disabled={true}
        className={className}
        tvState={tvState}
        isLoading={true}
      />
    );
  }

  // For non-loading state, use the custom PowerUpButton
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    if (!disabled) {
      setIsPressed(false);
      onClick();
    }
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
    setIsHovered(false);
  };

  // Power-up specific styling
  const buttonStyles = `
    absolute inset-0 rounded-md border-2 border-[#00aa00] font-mono text-center
    transition-all duration-300 ease-in-out tracking-wider unified-glow text-[#00ff00]
    ${
      isPressed && !disabled
        ? 'bg-gray-800 transform translate-y-1 shadow-none'
        : 'bg-gradient-to-b from-gray-700 to-gray-800 shadow-lg'
    }
    ${isHovered && !isPressed && !disabled ? 'from-gray-600 to-gray-700' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
  `;

  return (
    <div className={`w-full relative h-12 ${className}`}>
      {/* Button base/shadow */}
      <div className="absolute inset-0 rounded-md bg-gray-900 transform translate-y-1"></div>

      {/* Button body */}
      <button
        className={buttonStyles}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        aria-label="POWER UP"
      >
        <div className="flex items-center justify-center">
          <span className="font-bold">POWER UP</span>
          <span className="font-bold inline-flex items-center justify-center ml-1 relative top-[-1px] arrow-bounce">
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
      </button>
    </div>
  );
}
