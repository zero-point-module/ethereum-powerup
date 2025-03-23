'use client';

import { useEffect, useState, useRef } from 'react';
import { EthereumLogo3D } from './ethereum-logo-3d';
import { crtScreenStyles } from '@/styles/common-styles';
import type { CircularDisplayProps } from '@/types';

export function CircularDisplay({ state }: CircularDisplayProps) {
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [noisePositions, setNoisePositions] = useState<
    Array<{ left: string; top: string; width: string; height: string }>
  >([]);

  // Simulate CRT warm-up effect
  useEffect(() => {
    if (state !== 'off') {
      let intensity = 0;
      const interval = setInterval(() => {
        intensity += 0.1;
        if (intensity >= 1) {
          intensity = 1;
          clearInterval(interval);
        }
        setGlowIntensity(intensity);
      }, 100);

      return () => clearInterval(interval);
    } else {
      setGlowIntensity(0);
    }
  }, [state]);

  // Generate random static noise and animate it
  useEffect(() => {
    if (state === 'off') {
      setNoisePositions([]);
      return;
    }

    // Generate initial noise
    generateNoise();

    // Set up animation interval
    const interval = setInterval(() => {
      generateNoise();
    }, 100); // Update every 100ms for animation

    return () => clearInterval(interval);
  }, [state]);

  // Function to generate random noise positions
  const generateNoise = () => {
    const newNoise = [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 2 + 0.5}px`,
      height: `${Math.random() * 2 + 0.5}px`,
    }));
    setNoisePositions(newNoise);
  };

  return (
    <div className="relative w-32 h-32">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-gray-800 bg-gray-900 shadow-inner"></div>

      {/* Screen background with dynamic glow based on state */}
      <div
        className={`absolute inset-2 ${crtScreenStyles.base} ${
          state === 'off' ? crtScreenStyles.off : ''
        }`}
        style={{
          boxShadow:
            state !== 'off'
              ? crtScreenStyles.glowFilter(glowIntensity)
              : 'none',
          overflow: 'hidden',
        }}
      >
        {/* 3D Ethereum logo for active state */}
        {state === 'active' && <EthereumLogo3D animate={true} />}

        {/* SVG filters for glow effects */}
        <svg width="0" height="0">
          <defs>
            <filter id="glow3d">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Grid background for depth reference - radar effect */}
        {state !== 'off' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
              {/* Circular grid lines */}
              {[...Array(3)].map((_, i) => (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={15 + i * 10}
                  fill="none"
                  stroke="#00ff00"
                  strokeWidth="0.5"
                  strokeDasharray="1,3"
                />
              ))}
            </svg>
          </div>
        )}

        {/* Scan line effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0)_100%)] bg-[length:100%_2px]"></div>
        </div>

        {/* CRT flicker effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-green-900 opacity-5 animate-flicker"></div>
        </div>

        {/* Animated static noise effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          {noisePositions.map((pos, i) => (
            <div
              key={i}
              className="absolute bg-[#00ff00] opacity-30"
              style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                height: pos.height,
              }}
            ></div>
          ))}
        </div>

        {/* Glass reflection */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white to-transparent opacity-5"></div>

        {/* Screen edge highlight */}
        <div className="absolute inset-2 rounded-full border border-gray-800 pointer-events-none"></div>
      </div>
    </div>
  );
}
