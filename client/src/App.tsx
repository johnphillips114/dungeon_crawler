import { useState, useMemo } from 'react';
import { generateDungeon, renderMapToString, isMapTraversable, getStartPosition } from './game/map';
import type { DungeonMap, Position } from './game/map';

function App() {
  const initialData = useMemo(() => {
    const newMap = generateDungeon();
    return {
      map: newMap,
      traversable: isMapTraversable(newMap),
      startPos: getStartPosition(newMap),
    };
  }, []);

  const [map] = useState<DungeonMap>(initialData.map);
  const [playerPos, setPlayerPos] = useState<Position>(initialData.startPos);
  const [traversable] = useState<boolean>(initialData.traversable);

  const regenerateMap = () => {
    const newMap = generateDungeon();
    const startPos = getStartPosition(newMap);
    setPlayerPos(startPos);
  };

  const mapDisplay = renderMapToString(map, playerPos);

  return (
    <div>
      <h1>Dungeon Crawler</h1>
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
      <div style={{ marginTop: '16px' }}>
        <button onClick={regenerateMap}>Generate New Map</button>
        <span style={{ marginLeft: '16px' }}>
          Map traversable: {traversable ? '✓ Yes' : '✗ No'}
        </span>
        <span style={{ marginLeft: '16px' }}>
          Rooms: {map.rooms.length}
        </span>
      </div>
    </div>
  );
}

export default App;
