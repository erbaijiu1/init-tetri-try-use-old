import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View as TaroView, Text as TaroText, Button as TaroButton } from '@tarojs/components';
import {
  createGrid,
  checkCollision,
  randomPiece,
  rotateMatrix,
  sweepRows,
  ROWS,
  COLS,
  Grid
} from '../../utils/tetris';
import './index.scss';

// Workaround for type mismatch: Taro components are sometimes inferred as Vue components
// in certain TypeScript configurations, causing JSX errors in React.
const View = TaroView as any;
const Text = TaroText as any;
const Button = TaroButton as any;

const BrickGame = () => {
  const [grid, setGrid] = useState<Grid>(createGrid());
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    matrix: randomPiece().shape,
    collided: false,
  });
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Use refs for game loop timing if needed, though pure useEffect is used here for simplicity
  const requestRef = useRef<number>(0);

  // Initialize
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setGrid(createGrid());
    setPlayer({
      pos: { x: Math.floor(COLS / 2) - 1, y: 0 },
      matrix: randomPiece().shape,
      collided: false,
    });
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setDropTime(1000);
  };

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, grid, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const startGame = () => {
    resetGame();
  };

  const drop = () => {
    // Level up every 1000 points
    if (score > level * 1000) {
      setLevel(prev => prev + 1);
      setDropTime(Math.max(100, 1000 - (level * 100)));
    }

    if (!checkCollision(player, grid, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game Over check
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
        return;
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
    // Resume auto-drop after manual drop
    setDropTime(Math.max(100, 1000 - (level * 100)));
  };

  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };

  const playerRotate = (grid: Grid, dir: number) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.matrix = rotateMatrix(clonedPlayer.matrix);
    
    // Wall kick (basic)
    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, grid, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.matrix[0].length) {
        rotateMatrix(clonedPlayer.matrix); // Rotate back
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  // Game Loop
  useEffect(() => {
    if (!dropTime) return;
    
    const interval = setInterval(() => {
      drop();
    }, dropTime);

    return () => {
      clearInterval(interval);
    };
  }, [dropTime, player, grid]); 

  // Merging Logic
  useEffect(() => {
    if (player.collided) {
      // Merge
      const newGrid = grid.map(row => [...row]);
      player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            if (newGrid[y + player.pos.y] && newGrid[y + player.pos.y][x + player.pos.x] !== undefined) {
               newGrid[y + player.pos.y][x + player.pos.x] = value;
            }
          }
        });
      });

      const { grid: sweptGrid, cleared } = sweepRows(newGrid);
      if (cleared > 0) {
        setScore(prev => prev + cleared * 100 * level);
      }
      
      setGrid(sweptGrid);
      setPlayer({
        pos: { x: Math.floor(COLS / 2) - 1, y: 0 },
        matrix: randomPiece().shape,
        collided: false,
      });
    }
  }, [player.collided]);


  // Rendering the combined view of grid + active piece
  const displayGrid = grid.map(row => [...row]);
  if (!gameOver) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const py = y + player.pos.y;
          const px = x + player.pos.x;
          if (displayGrid[py] && displayGrid[py][px] !== undefined) {
            displayGrid[py][px] = value;
          }
        }
      });
    });
  }

  return (
    <View className="brick-game">
      <View className="game-container">
        <View className="screen-bezel">
            <View className="screen-glass">
                <View className="lcd-grid">
                {displayGrid.map((row, y) => (
                    <View className="row" key={y}>
                    {row.map((cell, x) => (
                        <View key={x} className={`cell ${cell ? 'active' : ''}`} />
                    ))}
                    </View>
                ))}
                </View>
                {gameOver && (
                    <View className="game-over-overlay">
                        <Text className="game-over-text">GAME OVER</Text>
                        <Button className="restart-btn" onClick={startGame}>RESTART</Button>
                    </View>
                )}
            </View>
        </View>

        <View className="stats-panel">
            <View className="stat-box">
                <Text className="label">SCORE</Text>
                <Text className="value">{score}</Text>
            </View>
            <View className="stat-box">
                <Text className="label">LEVEL</Text>
                <Text className="value">{level}</Text>
            </View>
        </View>

        <View className="controls-area">
            <View className="d-pad">
                <View className="pad-row">
                    <Button className="btn up" onClick={() => playerRotate(grid, 1)}></Button>
                </View>
                <View className="pad-row middle">
                    <Button className="btn left" onClick={() => movePlayer(-1)}></Button>
                    <View className="center-gap"></View>
                    <Button className="btn right" onClick={() => movePlayer(1)}></Button>
                </View>
                <View className="pad-row">
                    <Button className="btn down" onClick={dropPlayer}></Button>
                </View>
            </View>

            <View className="action-buttons">
                 <View className="btn-wrapper">
                    <Button className="btn-action a-btn" onClick={() => playerRotate(grid, 1)}>
                        <Text className="btn-label">ROTATE</Text>
                    </Button>
                 </View>
                 <View className="btn-wrapper">
                    <Button className="btn-action b-btn" onClick={dropPlayer}>
                        <Text className="btn-label">DROP</Text>
                    </Button>
                 </View>
            </View>
        </View>
        
        <View className="branding">
            <Text className="brand-text">SUPER BRICK</Text>
        </View>
      </View>
    </View>
  );
};

export default BrickGame;