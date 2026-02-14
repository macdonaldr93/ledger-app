import React from 'react';
import type { GameSettings } from '../../types/musical';
import styles from './Settings.module.css';

interface SettingsProps {
  settings: GameSettings;
  onUpdate: (newSettings: Partial<GameSettings>) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className={styles.settings}>
      <div className={styles.field}>
        <label>Clef</label>
        <div className={styles.buttonGroup}>
          {(['treble', 'bass', 'both'] as const).map(c => (
            <button
              key={c}
              className={settings.clef === c ? styles.active : ''}
              onClick={() => onUpdate({ clef: c })}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.field}>
        <label>Ledger Lines: {settings.maxLedgerLines}</label>
        <input
          type="range"
          min="0"
          max="6"
          value={settings.maxLedgerLines}
          onChange={(e) => onUpdate({ maxLedgerLines: parseInt(e.target.value) })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={settings.onlyLedgerLines}
            onChange={(e) => onUpdate({ onlyLedgerLines: e.target.checked })}
          />
          Only Ledger Lines
        </label>
      </div>
    </div>
  );
};
