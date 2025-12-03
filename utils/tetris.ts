export const ROWS = 20;
export const COLS = 10;

export type Grid = (string | number)[][];

export const SHAPES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: 1
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 1
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 1
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 1
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: 1
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 1
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: 1
  }
};

export const createGrid = (): Grid =>
  Array.from(Array(ROWS), () => Array(COLS).fill(0));

export const randomPiece = () => {
  const keys = Object.keys(SHAPES);
  const randKey = keys[Math.floor(Math.random() * keys.length)];
  return SHAPES[randKey];
};

export const rotateMatrix = (matrix: number[][]) => {
  return matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
};

export const checkCollision = (
  player: { pos: { x: number; y: number }; matrix: number[][] },
  grid: Grid,
  { x: moveX, y: moveY }: { x: number; y: number }
) => {
  for (let y = 0; y < player.matrix.length; y += 1) {
    for (let x = 0; x < player.matrix[y].length; x += 1) {
      if (player.matrix[y][x] !== 0) {
        if (
          !grid[y + player.pos.y + moveY] ||
          !grid[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          grid[y + player.pos.y + moveY][x + player.pos.x + moveX] !== 0
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const sweepRows = (newGrid: Grid) => {
  let cleared = 0;
  const sweptGrid = newGrid.reduce((ack, row) => {
    if (row.findIndex(cell => cell === 0) === -1) {
      cleared += 1;
      ack.unshift(Array(COLS).fill(0));
      return ack;
    }
    ack.push(row);
    return ack;
  }, [] as Grid);
  return { grid: sweptGrid, cleared };
};
