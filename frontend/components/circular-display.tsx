"use client"

import { useEffect, useState, useRef } from "react"
import type { CircularDisplayProps } from "@/types"

export function CircularDisplay({ state }: CircularDisplayProps) {
  const [glowIntensity, setGlowIntensity] = useState(0)
  const [rotationY, setRotationY] = useState(0)
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  // Simulate CRT warm-up effect
  useEffect(() => {
    if (state !== "off") {
      let intensity = 0
      const interval = setInterval(() => {
        intensity += 0.1
        if (intensity >= 1) {
          intensity = 1
          clearInterval(interval)
        }
        setGlowIntensity(intensity)
      }, 100)

      return () => clearInterval(interval)
    } else {
      setGlowIntensity(0)
    }
  }, [state])

  // Animation loop for 3D Ethereum logo - fixed rotation around Y axis
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      setRotationY((prev) => (prev + deltaTime * 0.05) % 360)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (state === "active") {
      requestRef.current = requestAnimationFrame(animate)
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
      }
    }
  }, [state])

  return (
    <div className="relative w-32 h-32">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-gray-800 bg-gray-900 shadow-inner"></div>

      {/* Screen background - more authentic green */}
      <div
        className={`absolute inset-2 rounded-full transition-colors duration-500 ${
          state === "off" ? "bg-gray-900" : "bg-[#001800]"
        }`}
        style={{
          boxShadow:
            state !== "off"
              ? `inset 0 0 10px rgba(0, 255, 0, ${glowIntensity * 0.3}), 0 0 ${glowIntensity * 15}px rgba(0, 255, 0, ${glowIntensity * 0.5})`
              : "none",
          overflow: "hidden",
        }}
      >
        {/* 3D Ethereum logo for active state */}
        {state === "active" && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* 3D scene container with perspective */}
            <div
              className="w-full h-full relative"
              style={{
                perspective: "1000px",
                perspectiveOrigin: "center center",
                overflow: "hidden",
              }}
            >
              {/* Circular mask to ensure content stays within boundaries */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                {/* 3D Ethereum model container */}
                <div
                  className="w-full h-full absolute left-0 top-0"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${rotationY}deg)`,
                    transformOrigin: "center center",
                  }}
                >
                  {/* Standard Ethereum logo with wireframe style */}
                  <div
                    className="absolute w-24 h-24 left-1/2 top-1/2 -ml-12 -mt-12"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Top pyramid */}
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Front face */}
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          transformStyle: "preserve-3d",
                          transform: "rotateY(0deg) translateZ(0px)",
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
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          transformStyle: "preserve-3d",
                          transform: "rotateY(-120deg) translateZ(0px)",
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
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          transformStyle: "preserve-3d",
                          transform: "rotateY(120deg) translateZ(0px)",
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
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Front face */}
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          transformStyle: "preserve-3d",
                          transform: "rotateY(0deg) translateZ(0px)",
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
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          transformStyle: "preserve-3d",
                          transform: "rotateY(-120deg) translateZ(0px)",
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
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          transformStyle: "preserve-3d",
                          transform: "rotateY(120deg) translateZ(0px)",
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

                    {/* Middle horizontal line */}
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <svg viewBox="0 0 100 100" width="100%" height="100%">
                        <line x1="30" y1="50" x2="70" y2="50" stroke="#00ff00" strokeWidth="1.5" opacity="0.9" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Grid background for depth reference */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
                    <defs>
                      <filter id="glow3d">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

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
              </div>
            </div>
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

        {/* Static effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          {state !== "off" &&
            [...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-[#00ff00] opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 0.5}px`,
                  height: `${Math.random() * 2 + 0.5}px`,
                }}
              ></div>
            ))}
        </div>
      </div>

      {/* Glass reflection */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white to-transparent opacity-5"></div>

      {/* Screen edge highlight */}
      <div className="absolute inset-2 rounded-full border border-gray-800 pointer-events-none"></div>
    </div>
  )
}

