'use client';

import { useState, ReactNode } from 'react';
import { TVState } from '@/types';

// Base button props
export interface BaseButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  tvState?: TVState;
  isLoading?: boolean;
  icon?: ReactNode;
}

export function BaseButton({
  label,
  onClick,
  disabled = false,
  className = '',
  isLoading = false,
  icon,
}: BaseButtonProps) {
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

  // Base button styling
  const buttonStyles = `
    absolute inset-0 rounded-md border-2 border-gray-800 font-mono text-center
    transition-all duration-300 ease-in-out tracking-wider text-[#00ff00]
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
      disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
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
        aria-label={label}
      >
        <div className="flex items-center justify-center">
          <span className="font-bold">{isLoading ? `${label}...` : label}</span>
          {isLoading && (
            <span className="font-bold inline-flex items-center justify-center ml-1 relative top-[-1px] animate-spin">
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
            </span>
          )}
          {!isLoading && icon}
        </div>
      </button>
    </div>
  );
}
