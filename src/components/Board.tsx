import React from 'react';
import { Board as BoardType, Tile } from '../logic/minesweeper';
import Cell from './Cell';

interface BoardProps {
  board: BoardType;
  gameStatus: string;
  failedChord: Tile | null;
  onLeftClick: (tile: Tile) => void;
  onRightClick: (e: React.MouseEvent, tile: Tile) => void;
  onMouseDown: (e: React.MouseEvent, tile: Tile) => void;
}

const Board: React.FC<BoardProps> = ({ board, gameStatus, failedChord, onLeftClick, onRightClick, onMouseDown }) => {
  return (
    <div className="board-container">
      <div
        className={`board ${gameStatus !== 'playing' ? 'game-over' : ''}`}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <Cell
                key={colIndex}
                {...cell}
                onClick={() => onLeftClick(cell)}
                onContextMenu={e => onRightClick(e, cell)}
                onMouseDown={e => onMouseDown(e, cell)}
                failedChord={failedChord !== null && failedChord.x === cell.x && failedChord.y === cell.y}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;