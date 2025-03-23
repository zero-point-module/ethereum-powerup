'use client';

import { useState, useEffect, useCallback } from 'react';
import { SCRAMBLE_CHARS } from '@/constants';

interface UseTextScrambleOptions {
  text: string;
  isActive: boolean;
  speed?: number;
  stabilizeSpeed?: number;
  key?: string;
}

export function useTextScramble({
  text,
  isActive,
  speed = 30,
  stabilizeSpeed = 0.1,
  key,
}: UseTextScrambleOptions) {
  const [displayText, setDisplayText] = useState('');
  const [scrambling, setScrambling] = useState(false);

  const startScramble = useCallback(() => {
    if (!isActive || !text) return;

    setScrambling(true);
    setDisplayText('');

    let displayedText = '';
    let fullTextRevealed = false;
    const scrambleChars = Array(text.length).fill(0);

    const interval = setInterval(() => {
      if (!fullTextRevealed) {
        // Gradually reveal the text
        const newLength = Math.min(displayedText.length + 3, text.length);
        displayedText = text.substring(0, newLength);

        // Check if we've revealed the full text
        if (displayedText.length >= text.length) {
          fullTextRevealed = true;
        }
      } else {
        // Stabilize characters one by one
        let allStabilized = true;
        let scrambledText = '';

        for (let i = 0; i < text.length; i++) {
          if (text[i] === '\n' || text[i] === ' ') {
            scrambledText += text[i];
            scrambleChars[i] = 1;
          } else if (scrambleChars[i] >= 1) {
            scrambledText += text[i];
          } else {
            // Randomly decide if this character should stabilize
            if (Math.random() < stabilizeSpeed) {
              scrambleChars[i] = 1;
              scrambledText += text[i];
            } else {
              scrambledText +=
                SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ];
              allStabilized = false;
            }
          }
        }

        displayedText = scrambledText;

        // End scrambling when all characters are stabilized
        if (allStabilized) {
          clearInterval(interval);
          setScrambling(false);
        }
      }

      setDisplayText(displayedText);
    }, speed);

    return () => clearInterval(interval);
  }, [isActive, text, speed, stabilizeSpeed]);

  useEffect(() => {
    if (isActive && text) {
      setDisplayText('');
      setScrambling(true);

      const cleanup = startScramble();
      return cleanup;
    } else {
      setDisplayText('');
      setScrambling(false);
    }
  }, [isActive, text, startScramble, key]);

  return { displayText, scrambling };
}
