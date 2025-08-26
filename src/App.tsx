import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import SettingsModal from './components/SettingsModal';
import GameEndOverlay from './components/GameEndOverlay';
import NewGameIcon from './components/icons/NewGameIcon';
import RestartIcon from './components/icons/RestartIcon';
import SettingsIcon from './components/icons/SettingsIcon';
import {
  createBoard,
  revealTile,
  markTile,
  chordTile,
  checkWin,
  checkLose,
  placeMines,
  revealBoard,
  revealRemaining,
  Board as BoardType,
  Tile,
} from './logic/minesweeper';
import './Game.css';

interface GameSettings {
  rows: number;
  cols: number;
  mines: number;
}

const LEVELS: { [key: string]: GameSettings } = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 10, cols: 10, mines: 20 },
  hard: { rows: 12, cols: 16, mines: 40 },
};

function App() {
  const [gameSettings, setGameSettings] = useState<GameSettings>(LEVELS.easy);
  const [customSettings, setCustomSettings] = useState<GameSettings>({ rows: 8, cols: 8, mines: 10 });
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [board, setBoard] = useState<BoardType>(() => createBoard(gameSettings.rows, gameSettings.cols));
  const [initialBoard, setInitialBoard] = useState<BoardType>(board);
  const [gameStatus, setGameStatus] = useState<string>('playing');
  const [failedChord, setFailedChord] = useState<Tile | null>(null);
  const [minesLeft, setMinesLeft] = useState<number>(gameSettings.mines);
  const [isFirstClick, setIsFirstClick] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>('light');
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    startNewGame();
  }, [gameSettings]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameStatus === 'playing' && !isFirstClick) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStatus, isFirstClick]);

  useEffect(() => {
    if (gameStatus === 'playing') {
      const markedTilesCount = board.flat().filter(tile => tile.status === 'marked').length;
      setMinesLeft(gameSettings.mines - markedTilesCount);

      if (checkWin(board)) {
        setGameStatus('win');
      }
      if (checkLose(board)) {
        setGameStatus('lose');
        setBoard(revealBoard(board));
      }

      if (minesLeft === 0) {
        setBoard(revealRemaining(board));
      }
    }
  }, [board, gameStatus, gameSettings.mines]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const startNewGame = () => {
    const newBoard = createBoard(gameSettings.rows, gameSettings.cols);
    setBoard(newBoard);
    setInitialBoard(newBoard);
    setGameStatus('playing');
    setMinesLeft(gameSettings.mines);
    setIsFirstClick(true);
    setTimer(0);
  };

  const restartGame = () => {
    setBoard(initialBoard);
    setGameStatus('playing');
    setMinesLeft(gameSettings.mines);
    setIsFirstClick(false);
    setTimer(0);
  };

  const handleLevelChange = (level: string) => {
    setIsCustom(false);
    setGameSettings(LEVELS[level]);
    setIsSettingsOpen(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomSettings(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      customSettings.rows > 0 && customSettings.rows <= 12 &&
      customSettings.cols > 0 && customSettings.cols <= 16 &&
      customSettings.mines > 0 &&
      customSettings.mines < customSettings.rows * customSettings.cols
    ) {
      setIsCustom(true);
      setGameSettings(customSettings);
      setIsSettingsOpen(false);
    }
  };

  const handleLeftClick = (tile: Tile) => {
    if (gameStatus !== 'playing') return;

    if (isFirstClick) {
      const newBoard = placeMines(board, gameSettings.mines, tile);
      setBoard(revealTile(newBoard, tile));
      setInitialBoard(newBoard);
      setIsFirstClick(false);
    } else {
      setBoard(revealTile(board, tile));
    }
  };

  const handleRightClick = (e: React.MouseEvent, tile: Tile) => {
    e.preventDefault();
    if (gameStatus !== 'playing') return;
    setBoard(markTile(board, tile));
  };

  const handleMouseDown = (e: React.MouseEvent, tile: Tile) => {
    if (e.buttons === 3 && gameStatus === 'playing') {
      const { board: newBoard, chording } = chordTile(board, tile);
      setBoard(newBoard);
      if (!chording) {
        setFailedChord(tile);
        setTimeout(() => setFailedChord(null), 200);
      }
    }
  };

  return (
    <div className="App" data-theme={theme}>
      {(gameStatus === 'win' || gameStatus === 'lose') && (
        <GameEndOverlay gameStatus={gameStatus} onPlayAgain={startNewGame} />
      )}
      <div className="game-container">
        <div className="header">
          <h1>Minesweeper</h1>
          <div className="game-actions">
            <button onClick={startNewGame} title="New Game"><NewGameIcon /></button>
            <button onClick={restartGame} title="Restart"><RestartIcon /></button>
            <button onClick={() => setIsSettingsOpen(true)} title="Settings"><SettingsIcon /></button>
          </div>
        </div>
        <div className="game-info">
          <div className="info-box">
            <span className="info-label">Mines</span>
            <span className="info-value">{minesLeft}</span>
          </div>
          <div className="info-box">
            <span className="info-label">Time</span>
            <span className="info-value">{timer}</span>
          </div>
        </div>
        <Board
          board={board}
          gameStatus={gameStatus}
          failedChord={failedChord}
          onLeftClick={handleLeftClick}
          onRightClick={handleRightClick}
          onMouseDown={handleMouseDown}
        />
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        gameSettings={gameSettings}
        onLevelChange={handleLevelChange}
        onCustomSubmit={handleCustomSubmit}
        customSettings={customSettings}
        onCustomChange={handleCustomChange}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}

export default App;