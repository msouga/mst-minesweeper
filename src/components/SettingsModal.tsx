import React from 'react';

interface GameSettings {
  rows: number;
  cols: number;
  mines: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameSettings: GameSettings;
  onLevelChange: (level: string) => void;
  onCustomSubmit: (e: React.FormEvent) => void;
  customSettings: GameSettings;
  onCustomChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: string;
  onToggleTheme: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  gameSettings,
  onLevelChange,
  onCustomSubmit,
  customSettings,
  onCustomChange,
  theme,
  onToggleTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="close-button">&times;</button>
        <h2>Settings</h2>
        <div className="settings-section">
          <h3>Difficulty</h3>
          <div className="level-selector">
            <div className="radio-group">
                <input type="radio" id="easy" name="difficulty" value="easy" checked={gameSettings.rows === 8} onChange={() => onLevelChange('easy')} />
                <label htmlFor="easy">Easy</label>
                <input type="radio" id="medium" name="difficulty" value="medium" checked={gameSettings.rows === 10} onChange={() => onLevelChange('medium')} />
                <label htmlFor="medium">Medium</label>
                <input type="radio" id="hard" name="difficulty" value="hard" checked={gameSettings.rows === 12} onChange={() => onLevelChange('hard')} />
                <label htmlFor="hard">Hard</label>
            </div>
          </div>
        </div>
        <div className="settings-section">
          <h3>Custom Game</h3>
          <form onSubmit={onCustomSubmit} className="custom-form">
            <input type="number" name="rows" placeholder="Rows" value={customSettings.rows} onChange={onCustomChange} max={12} />
            <input type="number" name="cols" placeholder="Cols" value={customSettings.cols} onChange={onCustomChange} max={16} />
            <input type="number" name="mines" placeholder="Mines" value={customSettings.mines} onChange={onCustomChange} />
            <button type="submit">Apply Custom</button>
          </form>
        </div>
        <div className="settings-section">
          <h3>Theme</h3>
          <div className="theme-switcher">
            <span>Light</span>
            <label className="switch">
              <input type="checkbox" checked={theme === 'dark'} onChange={onToggleTheme} />
              <span className="slider round"></span>
            </label>
            <span>Dark</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;