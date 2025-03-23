'use client';

import { useState, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface ScrambleTextProps {
  text: string;
  isScrambling: boolean;
  position: [number, number, number];
  fontSize: number;
  maxWidth?: number;
}

const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?`~';

export default function ScrambleText({
  text,
  isScrambling,
  position,
  fontSize,
  maxWidth,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState('');
  const frameCount = useRef(0);
  const groupRef = useRef<any>(null);

  // Handle scrambling animation
  useFrame(() => {
    if (isScrambling) {
      frameCount.current += 1;

      // Update scrambled text every few frames
      if (frameCount.current % 3 === 0) {
        let scrambled = '';
        const targetLength = Math.min(
          text.length,
          Math.floor(frameCount.current / 10)
        );

        for (let i = 0; i < targetLength; i++) {
          // Keep spaces as spaces
          if (text[i] === ' ') {
            scrambled += ' ';
          } else {
            // Gradually stabilize characters from left to right
            if (i < targetLength / 2) {
              scrambled += text[i];
            } else {
              scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
            }
          }
        }

        // Fill the rest with random characters
        for (let i = targetLength; i < text.length; i++) {
          if (text[i] === ' ') {
            scrambled += ' ';
          } else {
            scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        setDisplayText(scrambled);
      }
    } else {
      frameCount.current = 0;
      setDisplayText(text);
    }
  });

  // Terminal-like blinking cursor effect
  useFrame(({ clock }) => {
    if (groupRef.current && !isScrambling && text) {
      const blink = Math.floor(clock.getElapsedTime() * 2) % 2 === 0;
      if (blink) {
        setDisplayText(text + '█');
      } else {
        setDisplayText(text);
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Text
        fontSize={fontSize}
        color="#0f0"
        font="/fonts/GeistMono-Regular.ttf"
        maxWidth={maxWidth}
        textAlign="left"
        anchorX="center"
        anchorY="middle"
        lineHeight={1.5}
      >
        {displayText}
      </Text>
    </group>
  );
}
