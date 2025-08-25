export type TileStatus =
  | 'hidden'
  | 'mine'
  | 'number'
  | 'marked'
  | 'incorrectly-marked';

export interface Position {
  x: number;
  y: number;
}

export interface Tile extends Position {
  mine: boolean;
  status: TileStatus;
  adjacentMinesCount: number;
}

export type Board = Tile[][];

export const TILE_STATUSES: { [key: string]: TileStatus } = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
  INCORRECTLY_MARKED: "incorrectly-marked",
};

export function createBoard(rows: number, cols: number): Board {
  const board: Board = [];
  for (let x = 0; x < rows; x++) {
    const row: Tile[] = [];
    for (let y = 0; y < cols; y++) {
      const tile: Tile = {
        x,
        y,
        mine: false,
        status: TILE_STATUSES.HIDDEN,
        adjacentMinesCount: 0,
      };
      row.push(tile);
    }
    board.push(row);
  }
  return board;
}

export function placeMines(board: Board, numberOfMines: number, exclude?: Position): Board {
  const rows = board.length;
  const cols = board[0].length;
  const minePositions = getMinePositions(rows, cols, numberOfMines, exclude);

  const newBoard = board.map(row => row.map(tile => ({ ...tile })));

  minePositions.forEach(pos => {
    newBoard[pos.x][pos.y].mine = true;
  });

  // Calculate adjacent mines for each tile
  newBoard.forEach(row => {
    row.forEach(tile => {
      if (!tile.mine) {
        const adjacentTiles = getAdjacentTiles(newBoard, tile);
        tile.adjacentMinesCount = adjacentTiles.filter(t => t.mine).length;
      }
    });
  });

  return newBoard;
}

export function markTile(board: Board, { x, y }: Position): Board {
  const tile = board[x][y];
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  ) {
    return board;
  }

  const newBoard = board.map(row => [...row]); // Create a new board
  if (tile.status === TILE_STATUSES.MARKED) {
    newBoard[x][y] = { ...tile, status: TILE_STATUSES.HIDDEN };
  } else {
    newBoard[x][y] = { ...tile, status: TILE_STATUSES.MARKED };
  }
  return newBoard;
}

export function revealTile(board: Board, tile: Tile): Board {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return board;
  }

  let newBoard = board.map(row => row.map(t => ({ ...t })));
  let newTile = newBoard[tile.x][tile.y];

  if (newTile.mine) {
    newTile.status = TILE_STATUSES.MINE;
    return newBoard;
  }

  newTile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = getAdjacentTiles(newBoard, newTile);
  const mines = adjacentTiles.filter(t => t.mine);

  if (mines.length === 0) {
    adjacentTiles.forEach(t => {
      if (t.status === TILE_STATUSES.HIDDEN) {
        newBoard = revealTile(newBoard, t);
      }
    });
  } else {
    newTile.adjacentMinesCount = mines.length;
  }

  return newBoard;
}

export function chordTile(board: Board, tile: Tile): { board: Board; chording: boolean } {
  if (tile.status !== TILE_STATUSES.NUMBER) {
    return { board, chording: false };
  }

  const adjacentTiles = getAdjacentTiles(board, tile);
  const markedTiles = adjacentTiles.filter(
    t => t.status === TILE_STATUSES.MARKED
  );

  if (markedTiles.length !== tile.adjacentMinesCount) {
    return { board, chording: false };
  }

  let newBoard = board;
  adjacentTiles.forEach(t => {
    if (t.status === TILE_STATUSES.HIDDEN) {
      newBoard = revealTile(newBoard, t);
    }
  });

  return { board: newBoard, chording: true };
}

export function checkWin(board: Board): boolean {
  return board.every(row => {
    return row.every(tile => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
      );
    });
  });
}

export function checkLose(board: Board): boolean {
  return board.some(row => {
    return row.some(tile => {
      return tile.status === TILE_STATUSES.MINE;
    });
  });
}

export function revealBoard(board: Board): Board {
  return board.map(row => {
    return row.map(tile => {
      if (tile.status === TILE_STATUSES.MARKED) {
        if (tile.mine) {
          return { ...tile, status: TILE_STATUSES.MARKED };
        } else {
          return { ...tile, status: 'incorrectly-marked' as TileStatus };
        }
      }
      if (tile.mine) {
        return { ...tile, status: TILE_STATUSES.MINE };
      }
      return tile;
    });
  });
}

export function revealRemaining(board: Board): Board {
    let newBoard = board;
    board.forEach(row => {
        row.forEach(tile => {
            if (tile.status === TILE_STATUSES.HIDDEN) {
                newBoard = revealTile(newBoard, tile);
            }
        });
    });
    return newBoard;
}

function getMinePositions(rows: number, cols: number, numberOfMines: number, exclude?: Position): Position[] {
  const positions: Position[] = [];
  const excludePos = exclude ? [exclude] : [];

  while (positions.length < numberOfMines) {
    const position: Position = {
      x: randomNumber(rows),
      y: randomNumber(cols),
    };

    if (!positions.some(p => positionMatch(p, position)) && !excludePos.some(p => positionMatch(p, position))) {
      positions.push(position);
    }
  }
  return positions;
}

function positionMatch(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

function randomNumber(size: number): number {
  return Math.floor(Math.random() * size);
}

function getAdjacentTiles(board: Board, { x, y }: Position): Tile[] {
  const tiles: Tile[] = [];
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      if (xOffset === 0 && yOffset === 0) continue;
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) tiles.push(tile);
    }
  }
  return tiles;
}