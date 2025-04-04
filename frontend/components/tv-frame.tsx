'use client';

import type { TVFrameProps } from '@/types';

export function TVFrame({ children }: TVFrameProps) {
  return (
    <div className="w-full h-full relative">
      {/* Outer frame with texture */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 shadow-2xl border-8 border-gray-800 overflow-hidden scale-125 origin-center transform -translate-y-2">
        {/* Inner frame with bevel effect */}
        <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800">
          {/* Screen bezel */}
          <div className="absolute inset-2 rounded-md bg-black p-1">
            {/* Screen content */}
            <div className="relative w-full h-full rounded overflow-hidden bg-black">
              {/* CRT scan lines effect - more pronounced */}
              <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0)_100%)] bg-[length:100%_2px]"></div>

              {/* CRT curvature effect - more pronounced */}
              <div className="absolute inset-0 pointer-events-none z-10 rounded-lg shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]"></div>

              {/* Screen content */}
              <div className="relative z-0 w-full h-full py-2">{children}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-4 bg-gray-800 rounded-b-xl"></div>

      {/* Ventilation slots */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-1 h-3 bg-gray-900 rounded-sm"></div>
        ))}
      </div>
    </div>
  );
}
