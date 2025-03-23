'use client';

import { useState } from 'react';
import type { ActionButtonProps } from '@/types';

export function ActionButton({
  label,
  onClick,
  disabled = false,
  className = '',
  tvState = 'off',
  variant = 'default',
  isWorkbenchActive = false,
  onWorkbenchClick = () => {},
}: ActionButtonProps) {
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

  const handleWorkbenchClick = () => {
    if (!disabled) {
      onWorkbenchClick();
    }
  };

  // Determine button styling based on variant
  const getButtonStyles = () => {
    // Base styles that apply to all buttons
    const baseStyles = `
      absolute inset-0 rounded-md border-2 font-mono text-center
      transition-all duration-300 ease-in-out tracking-wider
      ${
        isPressed && !disabled
          ? 'bg-gray-800 transform translate-y-1 shadow-none'
          : 'bg-gradient-to-b from-gray-700 to-gray-800 shadow-lg'
      }
      ${isHovered && !isPressed && !disabled ? 'from-gray-600 to-gray-700' : ''}
      ${
        disabled
          ? 'opacity-50 cursor-not-allowed border-gray-800'
          : 'cursor-pointer'
      }
      ${tvState === 'on' && variant !== 'power-up' ? 'blur-[2px]' : ''}
      focus:outline-none focus:ring-2 focus:ring-opacity-50
    `;

    // Variant-specific styles
    switch (variant) {
      case 'power-up':
        return `${baseStyles} unified-glow text-[#00ff00] focus:ring-green-400 border-[#00aa00]`;
      case 'install':
      case 'uninstall':
        return `${baseStyles} text-[#00ff00] border-[#004000] focus:ring-green-400 hover:border-[#00aa00]`;
      case 'default':
      default:
        return `${baseStyles} text-[#00ff00] border-gray-800 focus:ring-green-400`;
    }
  };

  // Render button content based on variant
  const renderButtonContent = () => {
    if (variant === 'power-up') {
      return (
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
      );
    } else if (variant === 'install') {
      return (
        <div className="flex items-center justify-center">
          <span>{label.replace(' MODULE', '')}</span>
          <span className="ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </span>
        </div>
      );
    } else if (variant === 'uninstall') {
      // We'll return null here because we'll handle the uninstall button differently
      return null;
    } else {
      return <span>{label}</span>;
    }
  };

  if (variant === 'uninstall') {
    return (
      <div className={`w-full relative h-12 ${className} flex gap-2`}>
        {/* Uninstall button */}
        <div className="flex-1 relative">
          {/* Button base/shadow */}
          <div className="absolute inset-0 rounded-md bg-gray-900 transform translate-y-1"></div>

          {/* Button body */}
          <button
            className={getButtonStyles()}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            aria-label={label}
          >
            <div className="flex items-center justify-center">
              <span>UNINSTALL</span>
              <span className="ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </span>
            </div>
          </button>
        </div>

        {/* Workbench button */}
        <div className="w-12 relative">
          {/* Button base/shadow */}
          <div className="absolute inset-0 rounded-md bg-gray-900 transform translate-y-1"></div>

          {/* Button body */}
          <button
            className={`
  absolute inset-0 rounded-md border-2 font-mono text-center
  transition-all duration-300 ease-in-out
  bg-gradient-to-b from-gray-700 to-gray-800 shadow-lg
  text-[#00ff00] ${
    isWorkbenchActive
      ? 'border-[#00ff00] bg-[#003000] shadow-[0_0_12px_rgba(0,255,0,0.5)]'
      : 'border-[#004000] hover:border-[#00aa00]'
  }
  focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none
`}
            onClick={handleWorkbenchClick}
            aria-label="Workbench"
            aria-pressed={isWorkbenchActive}
          >
            <div className="flex items-center justify-center w-full h-full transition-all duration-300 focus:outline-none focus:ring-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isWorkbenchActive ? 'animate-pulse' : ''}
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={`w-full relative h-12 ${className}`}>
        {/* Button base/shadow */}
        <div className="absolute inset-0 rounded-md bg-gray-900 transform translate-y-1"></div>

        {/* Button body */}
        <button
          className={getButtonStyles()}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseEnter={() => !disabled && setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
          aria-label={label}
        >
          {renderButtonContent()}
        </button>
      </div>
    );
  }
}
