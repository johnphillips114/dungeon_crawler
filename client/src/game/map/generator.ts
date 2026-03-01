import { createEmptyMap, isWalkable } from './types';
import type { DungeonMap, Room, Position } from './types';

interface BSPNode {
  x: number;
  y: number;
  width: number;
  height: number;
  room?: Room;
  left?: BSPNode;
  right?: BSPNode;
}

const MIN_ROOM_SIZE = 5;
const MAX_ROOM_SIZE = 12;
const MAP_WIDTH = 80;
const MAP_HEIGHT = 25;

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createLeaf(x: number, y: number, width: number, height: number): BSPNode {
  return { x, y, width, height };
}

function splitLeaf(leaf: BSPNode): BSPNode[] {
  const canSplitH = leaf.width > MIN_ROOM_SIZE * 2;
  const canSplitV = leaf.height > MIN_ROOM_SIZE * 2;

  if (!canSplitH && !canSplitV) {
    return [leaf];
  }

  let splitH: boolean;
  if (canSplitH && canSplitV) {
    splitH = Math.random() > 0.5;
  } else {
    splitH = canSplitH;
  }

  const max = (splitH ? leaf.width : leaf.height) - MIN_ROOM_SIZE;
  const min = MIN_ROOM_SIZE;

  if (max <= min) {
    return [leaf];
  }

  const splitPos = random(min, max);

  if (splitH) {
    const left = createLeaf(leaf.x, leaf.y, splitPos, leaf.height);
    const right = createLeaf(leaf.x + splitPos, leaf.y, leaf.width - splitPos, leaf.height);
    return [left, right];
  } else {
    const top = createLeaf(leaf.x, leaf.y, leaf.width, splitPos);
    const bottom = createLeaf(leaf.x, leaf.y + splitPos, leaf.width, leaf.height - splitPos);
    return [top, bottom];
  }
}

function buildBSPTree(
  leaves: BSPNode[],
  depth: number = 0
): BSPNode[] {
  if (leaves.length >= 8) {
    return leaves;
  }

  const newLeaves: BSPNode[] = [];

  for (const leaf of leaves) {
    if (!leaf.left && !leaf.right) {
      const siblings = splitLeaf(leaf);
      if (siblings.length === 1) {
        newLeaves.push(siblings[0]);
      } else {
        leaf.left = siblings[0];
        leaf.right = siblings[1];
        newLeaves.push(siblings[0], siblings[1]);
      }
    } else {
      newLeaves.push(leaf);
    }
  }

  if (newLeaves.length === leaves.length) {
    return newLeaves;
  }

  return buildBSPTree(newLeaves, depth + 1);
}

function createRoomInLeaf(leaf: BSPNode): Room {
  const width = random(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, leaf.width - 2));
  const height = random(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, leaf.height - 2));

  const x = random(leaf.x + 1, leaf.x + leaf.width - width - 1);
  const y = random(leaf.y + 1, leaf.y + leaf.height - height - 1);

  const center: Position = {
    x: Math.floor(x + width / 2),
    y: Math.floor(y + height / 2),
  };

  const room: Room = { x, y, width, height, center };
  leaf.room = room;
  return room;
}

function carveRoom(map: DungeonMap, room: Room): void {
  for (let y = room.y; y < room.y + room.height; y++) {
    for (let x = room.x; x < room.x + room.width; x++) {
      map.tiles[y][x].type = 'floor';
    }
  }
}

function carveCorridor(map: DungeonMap, start: Position, end: Position): void {
  let x = start.x;
  let y = start.y;

  while (x !== end.x) {
    if (map.tiles[y][x].type === 'wall') {
      map.tiles[y][x].type = 'corridor';
    }
    x += x < end.x ? 1 : -1;
  }

  while (y !== end.y) {
    if (map.tiles[y][x].type === 'wall') {
      map.tiles[y][x].type = 'corridor';
    }
    y += y < end.y ? 1 : -1;
  }
}

function connectLeaves(node: BSPNode, map: DungeonMap): void {
  if (!node.left || !node.right) {
    return;
  }

  const leftRoom = getRoom(node.left);
  const rightRoom = getRoom(node.right);

  if (leftRoom && rightRoom) {
    if (Math.random() > 0.5) {
      carveCorridor(map, leftRoom.center, rightRoom.center);
    } else {
      carveCorridor(map, rightRoom.center, leftRoom.center);
    }
  }

  connectLeaves(node.left, map);
  connectLeaves(node.right, map);
}

function getRoom(node: BSPNode): Room | undefined {
  if (node.room) {
    return node.room;
  }
  if (node.left) {
    const leftRoom = getRoom(node.left);
    if (leftRoom) return leftRoom;
    if (node.right) return getRoom(node.right);
  }
  return undefined;
}

export function generateDungeon(): DungeonMap {
  const map = createEmptyMap(MAP_WIDTH, MAP_HEIGHT);

  const rootLeaf = createLeaf(0, 0, MAP_WIDTH, MAP_HEIGHT);
  const leaves = buildBSPTree([rootLeaf]);

  for (const leaf of leaves) {
    const room = createRoomInLeaf(leaf);
    carveRoom(map, room);
    map.rooms.push(room);
  }

  connectLeaves(rootLeaf, map);

  if (map.rooms.length > 1) {
    const startRoom = map.rooms[0];
    const farthestRoom = map.rooms.reduce(( farthest, room ) => {
      const dist = Math.abs(room.center.x - startRoom.center.x) + 
                   Math.abs(room.center.y - startRoom.center.y);
      const farthestDist = Math.abs(farthest.center.x - startRoom.center.x) + 
                          Math.abs(farthest.center.y - startRoom.center.y);
      return dist > farthestDist ? room : farthest;
    });

    map.exitPosition = farthestRoom.center;
    map.tiles[farthestRoom.center.y][farthestRoom.center.x].type = 'exit';
  }

  return map;
}

export function getStartPosition(map: DungeonMap): Position {
  if (map.rooms.length > 0) {
    return map.rooms[0].center;
  }
  return { x: Math.floor(MAP_WIDTH / 2), y: Math.floor(MAP_HEIGHT / 2) };
}

function floodFill(
  map: DungeonMap,
  start: Position,
  visited: Set<string>
): void {
  const stack: Position[] = [start];
  
  while (stack.length > 0) {
    const pos = stack.pop()!;
    const key = `${pos.x},${pos.y}`;
    
    if (visited.has(key)) continue;
    if (!isWalkable(map, pos)) continue;
    
    visited.add(key);
    
    stack.push({ x: pos.x + 1, y: pos.y });
    stack.push({ x: pos.x - 1, y: pos.y });
    stack.push({ x: pos.x, y: pos.y + 1 });
    stack.push({ x: pos.x, y: pos.y - 1 });
  }
}

export function isMapTraversable(map: DungeonMap): boolean {
  const visited = new Set<string>();
  const start = getStartPosition(map);
  
  floodFill(map, start, visited);
  
  for (const room of map.rooms) {
    const key = `${room.center.x},${room.center.y}`;
    if (!visited.has(key)) {
      return false;
    }
  }
  
  return true;
}

export function renderMapToString(map: DungeonMap, playerPos?: Position): string {
  let output = '';
  
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tile = map.tiles[y][x];
      
      if (playerPos && playerPos.x === x && playerPos.y === y) {
        output += '@';
      } else if (tile.type === 'wall') {
        output += '#';
      } else if (tile.type === 'floor') {
        output += '.';
      } else if (tile.type === 'corridor') {
        output += '·';
      } else if (tile.type === 'exit') {
        output += '>';
      } else {
        output += ' ';
      }
    }
    output += '\n';
  }
  
  return output;
}
