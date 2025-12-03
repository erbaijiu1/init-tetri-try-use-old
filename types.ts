export type Cell = 0 | [number | string, string]; // 0 is empty, [value, state] is filled

export type BoardShape = Cell[][];

export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Tetromino {
  shape: number[][];
  type: TetrominoType;
}

export interface Player {
  pos: { x: number; y: number };
  tetromino: Tetromino;
  collided: boolean;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

export interface GameState {
  board: BoardShape;
  player: Player;
  score: number;
  rows: number;
  level: number;
  gameOver: boolean;
  dropTime: number | null;
  nextPiece: Tetromino;
}