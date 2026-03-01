import type { DungeonMap, Position } from '../map';
import type { Player } from '../entities';

export interface GameState {
  map: DungeonMap;
  player: Player;
  floor: number;
  message: string;
}

const VISIBILITY_RADIUS = 6;

function computeVisibility(map: DungeonMap, playerPos: Position): void {
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      map.tiles[y][x].visible = false;
    }
  }

  for (let dy = -VISIBILITY_RADIUS; dy <= VISIBILITY_RADIUS; dy++) {
    for (let dx = -VISIBILITY_RADIUS; dx <= VISIBILITY_RADIUS; dx++) {
      if (dx * dx + dy * dy > VISIBILITY_RADIUS * VISIBILITY_RADIUS) {
        continue;
      }

      const x = playerPos.x + dx;
      const y = playerPos.y + dy;

      if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
        continue;
      }

      if (isLineOfSightClear(map, playerPos, { x, y })) {
        map.tiles[y][x].visible = true;
        map.tiles[y][x].explored = true;
      }
    }
  }
}

function isLineOfSightClear(map: DungeonMap, start: Position, end: Position): boolean {
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  const sx = start.x < end.x ? 1 : -1;
  const sy = start.y < end.y ? 1 : -1;
  let err = dx - dy;

  let x = start.x;
  let y = start.y;

  while (true) {
    if (x === end.x && y === end.y) {
      return true;
    }

    if (map.tiles[y][x].type === 'wall') {
      return false;
    }

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

export function createGameState(map: DungeonMap, player: Player, floor: number = 1): GameState {
  const state: GameState = {
    map,
    player,
    floor,
    message: 'Use arrow keys or WASD to move. Reach the exit (>).',
  };
  computeVisibility(state.map, state.player.position);
  return state;
}

export function movePlayer(state: GameState, dx: number, dy: number): GameState {
  const newPos: Position = {
    x: state.player.position.x + dx,
    y: state.player.position.y + dy,
  };

  if (!isWithinBounds(state.map, newPos)) {
    return { ...state, message: 'Cannot move outside the dungeon.' };
  }

  const tile = state.map.tiles[newPos.y][newPos.x];

  if (tile.type === 'wall') {
    return { ...state, message: 'Blocked by a wall.' };
  }

  if (tile.type === 'exit') {
    return { ...state, message: 'You found the exit! Press > to descend.' };
  }

  const newPlayer: Player = {
    ...state.player,
    position: newPos,
  };

  const newMap = { ...state.map };
  newMap.tiles = [...state.map.tiles];
  newMap.tiles[newPos.y] = [...state.map.tiles[newPos.y]];

  computeVisibility(newMap, newPos);

  return {
    ...state,
    map: newMap,
    player: newPlayer,
    message: '',
  };
}

function isWithinBounds(map: DungeonMap, pos: Position): boolean {
  return pos.x >= 0 && pos.x < map.width && pos.y >= 0 && pos.y < map.height;
}

export function getVisibleTiles(map: DungeonMap): boolean[][] {
  const visible: boolean[][] = [];
  for (let y = 0; y < map.height; y++) {
    visible[y] = [];
    for (let x = 0; x < map.width; x++) {
      visible[y][x] = map.tiles[y][x].visible;
    }
  }
  return visible;
}

export function getExploredTiles(map: DungeonMap): boolean[][] {
  const explored: boolean[][] = [];
  for (let y = 0; y < map.height; y++) {
    explored[y] = [];
    for (let x = 0; x < map.width; x++) {
      explored[y][x] = map.tiles[y][x].explored;
    }
  }
  return explored;
}
