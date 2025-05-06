// RCWB – The website for the Royal College Western Band
// Copyright (C) 2025  Sanuka Weerabaddana 

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Inspired by Kevin from https://codemyui.com/console-style-text-animation-randomised-cursor/
import { useEffect, useRef } from 'react';

export default function ResolverEffect({ active, text, fallback }) {
  const config = {
    characters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','y','z'],
    updateInterval: 90,
    startProgress: 1
  };

  const elementRef = useRef(null);

  useEffect(() => {
    let interval;

    if (!active) {
      if (elementRef.current) {
        elementRef.current.textContent = fallback;
      }
      return;
    }

    const words = text.split(' ');
    const wordStates = words.map(word => ({
      word,
      progress: config.startProgress
    }));

    const maxLength = Math.max(...words.map(w => w.length));

    function getRandomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomCharacter(chars) {
      return chars[getRandomInteger(0, chars.length - 1)];
    }

    function updateWords() {
      let allComplete = true;

      const display = wordStates.map(({ word, progress }) => {
        if (progress < word.length) {
          allComplete = false;
          const revealCount = Math.ceil((progress / maxLength) * (word.length - 1));
          return (
            word[0] +
            word.slice(1, revealCount + 1) +
            (revealCount + 1 < word.length ? randomCharacter(config.characters) : '')
          );
        }
        return word;
      });

      if (elementRef.current) {
        elementRef.current.textContent = display.join(' ');
      }

      wordStates.forEach(state => {
        if (state.progress < state.word.length) {
          state.progress++;
        }
      });

      if (allComplete) {
        clearInterval(interval);
      }
    }

    if (elementRef.current) {
      elementRef.current.textContent = words.map(w => w[0]).join(' ');
    }

    interval = setInterval(updateWords, config.updateInterval);

    return () => clearInterval(interval);
  }, [active, text, fallback]);

  return <span ref={elementRef} />;
}