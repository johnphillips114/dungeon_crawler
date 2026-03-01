import type { Position } from '../map';

export interface PlayerStats {
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface Player {
  position: Position;
  stats: PlayerStats;
}

export const DEFAULT_PLAYER_STATS: PlayerStats = {
  maxHp: 20,
  hp: 20,
  attack: 5,
  defense: 2,
  level: 1,
  xp: 0,
  xpToNextLevel: 50,
};

export function createPlayer(position: Position): Player {
  return {
    position,
    stats: { ...DEFAULT_PLAYER_STATS },
  };
}

export function takeDamage(player: Player, damage: number): Player {
  const newHp = Math.max(0, player.stats.hp - damage);
  return {
    ...player,
    stats: {
      ...player.stats,
      hp: newHp,
    },
  };
}

export function healPlayer(player: Player, amount: number): Player {
  const newHp = Math.min(player.stats.maxHp, player.stats.hp + amount);
  return {
    ...player,
    stats: {
      ...player.stats,
      hp: newHp,
    },
  };
}

export function gainXp(player: Player, amount: number): Player {
  let newXp = player.stats.xp + amount;
  let newLevel = player.stats.level;
  let newXpToNext = player.stats.xpToNextLevel;
  let newMaxHp = player.stats.maxHp;
  let newAttack = player.stats.attack;
  let newDefense = player.stats.defense;

  while (newXp >= newXpToNext) {
    newXp -= newXpToNext;
    newLevel += 1;
    newXpToNext = Math.floor(newXpToNext * 1.5);
    newMaxHp += 5;
    newAttack += 2;
    newDefense += 1;
  }

  return {
    ...player,
    stats: {
      ...player.stats,
      xp: newXp,
      level: newLevel,
      xpToNextLevel: newXpToNext,
      maxHp: newMaxHp,
      hp: newLevel > player.stats.level ? newMaxHp : player.stats.hp,
      attack: newAttack,
      defense: newDefense,
    },
  };
}
