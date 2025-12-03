
import { useState, useCallback, useMemo } from 'react';
import { createBoard, randomTetromino, BOARD_WIDTH, BOARD_HEIGHT, TETROMINOS } from '../constants';
import { useInterval } from './useInterval';
import { Player, BoardShape, GameStatus } from '../types';
import { sound } from '../utils/sound';

export const useGame = () => {
  // 'stage' only contains the locked pieces (the pile)
  const [stage, setStage] = useState<BoardShape>(createBoard());
  
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [rowsCleared, setRowsCleared] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [nextPiece, setNextPiece] = useState(randomTetromino());
  const [isSoundOn, setIsSoundOn] = useState(!sound.isMuted);

  const [player, setPlayer] = useState<Player>({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0], 
    collided: false,
  });

  const getSpeed = (lvl: number) => Math.max(100, 1000 - (lvl - 1) * 100);

  // Derived board for rendering: combines 'stage' + current 'player'
  const board = useMemo(() => {
    const newBoard = stage.map(row => [...row]);
    
    // Check if player should be drawn.
    // We draw the player if the game is active (PLAYING, PAUSED, GAME_OVER).
    // We do NOT draw in IDLE state (initial dummy piece).
    if (status !== GameStatus.IDLE && player.tetromino.shape) {
        player.tetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const targetY = y + player.pos.y;
                    const targetX = x + player.pos.x;
                    if (targetY >= 0 && targetY < BOARD_HEIGHT && targetX >= 0 && targetX < BOARD_WIDTH) {
                         newBoard[targetY][targetX] = [value, player.collided ? 'merged' : 'clear'];
                    }
                }
            });
        });
    }
    return newBoard;
  }, [player, stage, status]);

  const checkCollision = useCallback((
    pl: Player,
    st: BoardShape,
    { x: moveX, y: moveY }: { x: number; y: number }
  ) => {
    for (let y = 0; y < pl.tetromino.shape.length; y += 1) {
      for (let x = 0; x < pl.tetromino.shape[y].length; x += 1) {
        if (pl.tetromino.shape[y][x] !== 0) {
          const targetY = y + pl.pos.y + moveY;
          const targetX = x + pl.pos.x + moveX;

          if (
            !st[targetY] ||
            st[targetY][targetX] === undefined ||
            (st[targetY][targetX] !== 0 &&
              (st[targetY][targetX] as any)[1] !== 'clear')
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const movePlayer = useCallback((dir: number) => {
    if (status !== GameStatus.PLAYING) return;
    
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      sound.playMove();
      setPlayer(prev => ({ 
          ...prev, 
          pos: { x: prev.pos.x + dir, y: prev.pos.y },
          collided: false 
      }));
    }
  }, [status, checkCollision, player, stage]);

  const startGame = useCallback(() => {
    sound.playStart();
    // 1. Create fresh stage
    setStage(createBoard());
    
    // 2. Reset stats
    setRowsCleared(0);
    setScore(0);
    setLevel(1);
    
    // 3. Setup new pieces
    const startingPiece = randomTetromino();
    const next = randomTetromino();
    setNextPiece(next);
    
    // 4. Place player
    setPlayer({
      pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
      tetromino: startingPiece,
      collided: false,
    });

    // 5. Start game loop
    setStatus(GameStatus.PLAYING);
    setDropTime(1000);
  }, []);

  const pauseGame = useCallback(() => {
    sound.playMove(); // Audio feedback for button press
    if (status === GameStatus.PLAYING) {
      setStatus(GameStatus.PAUSED);
      setDropTime(null);
    } else if (status === GameStatus.PAUSED) {
      setStatus(GameStatus.PLAYING);
      setDropTime(getSpeed(level));
    }
  }, [status, level]);

  const sweepRows = (newStage: BoardShape) => {
    let cleared = 0;
    const sweptStage = newStage.reduce((ack, row) => {
      // Check if row is full (no 0s)
      if (row.findIndex((cell) => cell === 0) === -1) {
        cleared += 1;
        ack.unshift(new Array(newStage[0].length).fill(0));
        return ack;
      }
      ack.push(row);
      return ack;
    }, [] as BoardShape);
    
    if (cleared > 0) {
        sound.playClear();
        setRowsCleared(prev => prev + cleared);
        setScore(prev => prev + (cleared * 100 * level));
        // Speed up
        if (rowsCleared > (level * 10)) {
            setLevel(prev => prev + 1);
            setDropTime(1000 / (level + 1) + 200);
        }
    }
    return sweptStage;
  };

  const resetPlayer = useCallback(() => {
    const newPiece = nextPiece;
    setNextPiece(randomTetromino());
    
    const initialPos = { x: BOARD_WIDTH / 2 - 2, y: 0 };
    
    // Check for immediate collision (Game Over)
    const tempPlayer = {
        pos: initialPos,
        tetromino: newPiece,
        collided: false
    };

    if (checkCollision(tempPlayer, stage, { x: 0, y: 0 })) {
        sound.playGameOver();
        setStatus(GameStatus.GAME_OVER);
        setDropTime(null);
    }

    setPlayer({
      pos: initialPos,
      tetromino: newPiece,
      collided: false,
    });
  }, [nextPiece, stage, checkCollision]);

  const drop = useCallback(() => {
    // Increase level logic moved to sweepRows or keep here if preferred, but usually done on clear
    
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      setPlayer(prev => ({
          ...prev,
          pos: { x: prev.pos.x, y: prev.pos.y + 1 },
          collided: false
      }));
    } else {
      // Game Over check
      if (player.pos.y < 1) {
        sound.playGameOver();
        setStatus(GameStatus.GAME_OVER);
        setDropTime(null);
        return;
      }
      
      sound.playLand();

      // Lock piece
      const newStage = stage.map(row => [...row]);
      player.tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const targetY = y + player.pos.y;
                const targetX = x + player.pos.x;
                if (newStage[targetY]) {
                    newStage[targetY][targetX] = [value, 'merged'];
                }
            }
        });
      });

      const sweptStage = sweepRows(newStage);
      setStage(sweptStage);
      resetPlayer();
    }
  }, [player, stage, checkCollision, resetPlayer, rowsCleared, level]);

  const keyUp = useCallback(({ keyCode }: { keyCode: number }) => {
    if (!status || status === GameStatus.GAME_OVER) return;
    if (keyCode === 40) {
      setDropTime(getSpeed(level));
    }
  }, [status, level]);

  const dropPlayer = useCallback(() => {
    if (status !== GameStatus.PLAYING) return;
    
    let tempY = player.pos.y;
    // Calculate how far we can drop
    while (!checkCollision({ ...player, pos: { x: player.pos.x, y: tempY } }, stage, { x: 0, y: 1 })) {
        tempY += 1;
    }
    
    // Update position to bottom
    const finalPlayer = { ...player, pos: { x: player.pos.x, y: tempY }, collided: true };
    
    // Manually trigger lock logic to happen immediately
    sound.playLand();
    
    const newStage = stage.map(row => [...row]);
    finalPlayer.tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const targetY = y + tempY;
                const targetX = x + player.pos.x;
                if (newStage[targetY]) {
                    newStage[targetY][targetX] = [value, 'merged'];
                }
            }
        });
    });

    const sweptStage = sweepRows(newStage);
    setStage(sweptStage);
    resetPlayer();
    
  }, [status, player, stage, checkCollision, resetPlayer, level, rowsCleared]);

  const moveDown = useCallback(() => {
      if (status !== GameStatus.PLAYING) return;
      drop();
  }, [status, drop]);

  const playerRotate = useCallback((dir: number) => {
    if (status !== GameStatus.PLAYING) return;

    // Deep clone to avoid mutation during trial
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    
    // Rotate matrix function
    const rotateMatrix = (matrix: number[][]) => {
        const rotatedGrid = matrix.map((_, index) => matrix.map((col) => col[index]));
        if (dir > 0) return rotatedGrid.map((row) => row.reverse());
        return rotatedGrid.reverse();
    };

    clonedPlayer.tetromino.shape = rotateMatrix(clonedPlayer.tetromino.shape);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino.shape[0].length) {
        return; // Rotation failed
      }
    }
    sound.playRotate();
    setPlayer(clonedPlayer);
  }, [status, player, stage, checkCollision]);

  const toggleSound = useCallback(() => {
    const muted = sound.toggleMute();
    setIsSoundOn(!muted);
  }, []);

  useInterval(() => {
    drop();
  }, dropTime);

  return {
    board,
    status,
    score,
    level,
    rowsCleared,
    nextPiece,
    isSoundOn,
    movePlayer,
    dropPlayer, 
    moveDown, 
    rotate: playerRotate,
    startGame,
    pauseGame,
    keyUp,
    toggleSound
  };
};
