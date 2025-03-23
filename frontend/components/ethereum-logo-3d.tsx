import { useEffect, useRef, useState } from 'react';

interface EthereumLogo3DProps {
  animate: boolean;
}

export function EthereumLogo3D({ animate }: EthereumLogo3DProps) {
  const [rotationY, setRotationY] = useState(0);
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  // Animation loop for 3D Ethereum logo - fixed rotation around Y axis
  const animateLoop = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      setRotationY((prev) => (prev + deltaTime * 0.05) % 360);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animateLoop);
  };

  useEffect(() => {
    if (animate) {
      requestRef.current = requestAnimationFrame(animateLoop);
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [animate]);

  return (
    <div
      className="w-full h-full relative"
      style={{
        perspective: '1000px',
        perspectiveOrigin: 'center center',
        overflow: 'hidden',
      }}
    >
      {/* Circular mask to ensure content stays within boundaries */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* 3D Ethereum model container */}
        <div
          className="w-full h-full absolute left-0 top-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotationY}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Standard Ethereum logo with wireframe style */}
          <div
            className="absolute w-24 h-24 left-1/2 top-1/2 -ml-12 -mt-12"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Top pyramid */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Front face */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(0deg) translateZ(0px)',
                }}
              >
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <path
                    d="M50,10 L30,50 L70,50 Z"
                    stroke="#00ff00"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.9"
                    filter="url(#glow3d)"
                  />
                </svg>
              </div>

              {/* Left face */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(-120deg) translateZ(0px)',
                }}
              >
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <path
                    d="M50,10 L30,50 L70,50 Z"
                    stroke="#00ff00"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.7"
                    filter="url(#glow3d)"
                  />
                </svg>
              </div>

              {/* Right face */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(120deg) translateZ(0px)',
                }}
              >
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <path
                    d="M50,10 L30,50 L70,50 Z"
                    stroke="#00ff00"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.7"
                    filter="url(#glow3d)"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom pyramid */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Front face */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(0deg) translateZ(0px)',
                }}
              >
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <path
                    d="M30,50 L50,90 L70,50 Z"
                    stroke="#00ff00"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.9"
                    filter="url(#glow3d)"
                  />
                </svg>
              </div>

              {/* Left face */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(-120deg) translateZ(0px)',
                }}
              >
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <path
                    d="M30,50 L50,90 L70,50 Z"
                    stroke="#00ff00"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.7"
                    filter="url(#glow3d)"
                  />
                </svg>
              </div>

              {/* Right face */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(120deg) translateZ(0px)',
                }}
              >
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <path
                    d="M30,50 L50,90 L70,50 Z"
                    stroke="#00ff00"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.7"
                    filter="url(#glow3d)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
