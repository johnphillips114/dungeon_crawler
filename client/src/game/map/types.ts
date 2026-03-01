export interface Position {
  x: number;
  y: number;
}

export type TileType = 'wall' | 'floor' | 'corridor' | 'exit';

export interface Tile {
  type: TileType;
  explored: boolean;
  visible: boolean;
}

export interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
  center: Position;
}

export interface DungeonMap {
  width: number;
  height: number;
  tiles: Tile[][];
  rooms: Room[];
  exitPosition: Position;
}

export function createEmptyMap(width: number, height: number): DungeonMap {
  const tiles: Tile[][] = [];
  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      tiles[y][x] = {
        type: 'wall',
        explored: false,
        visible: false,
      };
    }
  }
  return {
    width,
    height,
    tiles,
    rooms: [],
    exitPosition: { x: 0, y: 0 },
  };
}

export function isWalkable(map: DungeonMap, pos: Position): boolean {
  if (pos.x < 0 || pos.x >= map.width || pos.y < 0 || pos.y >= map.height) {
    return false;
  }
  return map.tiles[pos.y][pos.x].type !== 'wall';
}
