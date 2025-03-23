'use client';

import { useState } from 'react';
import { BaseButtonProps } from './BaseButton';

interface PowerUpButtonProps extends Omit<BaseButtonProps, 'label'> {
  // No additional props needed
}

export function PowerUpButton({
  onClick,
  disabled = false,
  className = '',
  isLoading = false,
}: PowerUpButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = () => {
    if (!disabled && !isLoading) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    if (!disabled && !isLoading) {
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
      isPressed && !disabled && !isLoading
        ? 'bg-gray-800 transform translate-y-1 shadow-none'
        : 'bg-gradient-to-b from-gray-700 to-gray-800 shadow-lg'
    }
    ${
      isHovered && !isPressed && !disabled && !isLoading
        ? 'from-gray-600 to-gray-700'
        : ''
    }
    ${
      disabled
        ? 'opacity-50 cursor-not-allowed'
        : isLoading
        ? 'cursor-wait animate-pulse'
        : 'cursor-pointer'
    }
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
        onMouseEnter={() => !disabled && !isLoading && setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        disabled={disabled || isLoading}
        aria-label="POWER UP"
      >
        <div className="flex items-center justify-center">
          <span className={`font-bold ${isLoading ? 'text-pulse' : ''}`}>
            {isLoading ? 'POWERING UP...' : 'POWER UP'}
          </span>
          <span
            className={`font-bold inline-flex items-center justify-center ml-1 relative top-[-1px] ${
              isLoading ? 'animate-spin scale-110' : 'arrow-bounce'
            }`}
          >
            {isLoading ? (
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
                <path d="M12 22c5.523 0 10-4.477 10-10h-4a6 6 0 01-6 6v4z" />
                <path d="M12 2C6.477 2 2 6.477 2 12h4a6 6 0 016-6V2z" />
              </svg>
            ) : (
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
            )}
          </span>
        </div>
      </button>
    </div>
  );
}
