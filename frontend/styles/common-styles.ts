/**
 * Common styles shared across multiple components
 * Using Tailwind classes to maintain consistency
 */

// Green CRT screen styles
export const crtScreenStyles = {
  base: 'bg-[#001800] rounded-full transition-colors duration-500',
  off: 'bg-gray-900',
  glowFilter: (intensity: number) =>
    `inset 0 0 10px rgba(0, 255, 0, ${intensity * 0.3}), 0 0 ${
      intensity * 15
    }px rgba(0, 255, 0, ${intensity * 0.5})`,
};

// Panel styles for consistent UI elements
export const panelStyles = {
  outer: 'border-2 border-gray-800 bg-gray-900 rounded-md shadow-inner',
  inner: 'bg-black rounded p-3',
};

// Text styles for terminal output
export const terminalTextStyles = {
  base: 'font-mono text-green-500',
  dim: 'font-mono text-green-800',
  bright: 'font-mono text-green-400',
  alert: 'font-mono text-red-500',
  success: 'font-mono text-green-300',
};

// Button styles for different states
export const buttonStyles = {
  base: 'px-4 py-2 rounded transition-all duration-200 font-bold text-center',
  default: 'bg-gray-800 text-green-500 hover:bg-gray-700',
  powerUp: 'bg-green-800 text-white hover:bg-green-700',
  install: 'bg-blue-800 text-white hover:bg-blue-700',
  uninstall: 'bg-red-800 text-white hover:bg-red-700',
  disabled: 'bg-gray-900 text-gray-600 cursor-not-allowed',
};

// 3D transform styles
export const transform3dStyles = {
  preserve3d: 'transform-style: preserve-3d',
  perspective: 'perspective: 1000px; perspective-origin: center center',
};
