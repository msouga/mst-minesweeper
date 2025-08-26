import React from 'react';
import ReactConfetti from 'react-confetti';

interface GameEndOverlayProps {
  gameStatus: 'win' | 'lose';
  onPlayAgain: () => void;
}

const GameEndOverlay: React.FC<GameEndOverlayProps> = ({ gameStatus, onPlayAgain }) => {
  const message = gameStatus === 'win' ? 'You Win!' : 'Game Over';

  return (
    <div className="game-end-overlay">
      {gameStatus === 'win' && <ReactConfetti />}
      <div className="overlay-content">
        <h2>{message}</h2>
        <button onClick={onPlayAgain}>Play Again</button>
      </div>
    </div>
  );
};

export default GameEndOverlay;
