import { useState, useEffect, useCallback, useMemo } from 'react';
import { generateDungeon, getStartPosition, renderMapToString } from './game/map';
import { createPlayer } from './game/entities';
import { createGameState, movePlayer } from './game/engine';

function App() {
  const gameState = useMemo(() => {
    const map = generateDungeon();
    const startPos = getStartPosition(map);
    const player = createPlayer(startPos);
    return createGameState(map, player, 1);
  }, []);

  const [currentState, setCurrentState] = useState(gameState);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let dx = 0;
    let dy = 0;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        dy = -1;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        dy = 1;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        dx = -1;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        dx = 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    setCurrentState(prev => movePlayer(prev, dx, dy));
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const mapDisplay = renderMapToString(currentState.map, currentState.player.position);
  const { player, floor, message } = currentState;

  return (
    <div>
      <h1>Dungeon Crawler</h1>
      <div style={{ marginBottom: '8px' }}>
        <strong>Floor:</strong> {floor} | 
        <strong> HP:</strong> {player.stats.hp}/{player.stats.maxHp} |
        <strong> Level:</strong> {player.stats.level} |
        <strong> XP:</strong> {player.stats.xp}/{player.stats.xpToNextLevel}
      </div>
      <pre style={{ 
        fontFamily: 'monospace', 
        lineHeight: '1.2',
        backgroundColor: '#1a1a1a',
        color: '#cccccc',
        padding: '16px',
        display: 'inline-block',
      }}>
        {mapDisplay}
      </pre>
      <div style={{ marginTop: '16px', color: '#888' }}>
        {message || 'Use arrow keys or WASD to move.'}
      </div>
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
        @ = Player | . = Floor | · = Corridor | # = Wall | &gt; = Exit
      </div>
    </div>
  );
}

export default App;
