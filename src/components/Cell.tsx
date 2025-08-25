import React from 'react';
import { Tile, TILE_STATUSES } from '../logic/minesweeper';
import MineIcon from './icons/MineIcon';
import FlagIcon from './icons/FlagIcon';
import IncorrectlyMarkedFlagIcon from './icons/IncorrectlyMarkedFlagIcon';

interface CellProps extends Tile {
  failedChord: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

const Cell: React.FC<CellProps> = ({ status, mine, adjacentMinesCount, failedChord, ...props }) => {
  const getCellContent = () => {
    if (status === TILE_STATUSES.MARKED) return <FlagIcon />;
    if (status === TILE_STATUSES.INCORRECTLY_MARKED) return <IncorrectlyMarkedFlagIcon />;
    if (status === TILE_STATUSES.MINE) return <MineIcon />;
    if (status === TILE_STATUSES.NUMBER) {
      return adjacentMinesCount > 0 ? adjacentMinesCount : '';
    }
    return '';
  };

  return (
    <div
      className={`cell ${failedChord ? 'failed-chord' : ''}`.trim()}
      data-status={status}
      data-value={adjacentMinesCount}
      {...props}
    >
      {getCellContent()}
    </div>
  );
};

export default Cell;