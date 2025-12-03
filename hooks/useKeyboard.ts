import { useEffect } from 'react';
import { GameStatus } from '../types';

interface KeyboardHandlers {
  movePlayer: (dir: number) => void;
  moveDown: () => void;
  rotate: (dir: number) => void;
  dropPlayer: () => void;
  pauseGame: () => void;
  startGame: () => void;
  toggleSound: () => void;
  keyUp: (e: { keyCode: number }) => void;
}

export const useKeyboard = (
  status: GameStatus,
  handlers: KeyboardHandlers
) => {
  useEffect(() => {
    // Safety check: Don't run this hook logic on server or non-window environments (like Mini Program)
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (status === GameStatus.GAME_OVER) {
        if (e.code === 'KeyR') {
          handlers.startGame();
        }
        return;
      }

      switch (e.code) {
        case 'ArrowLeft':
          handlers.movePlayer(-1);
          break;
        case 'ArrowRight':
          handlers.movePlayer(1);
          break;
        case 'ArrowDown':
          handlers.moveDown();
          break;
        case 'ArrowUp':
          handlers.rotate(1);
          break;
        case 'Space':
          handlers.dropPlayer();
          break;
        case 'KeyP':
          handlers.pauseGame();
          break;
        case 'KeyR':
          handlers.startGame();
          break;
        case 'KeyS':
          handlers.toggleSound();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        handlers.keyUp({ keyCode: 40 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [status, handlers]);
};