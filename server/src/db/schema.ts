import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const runs = sqliteTable('runs', {
  id: int().primaryKey({ autoIncrement: true }),
  playerName: text('player_name').notNull(),
  score: int().notNull().default(0),
  floorsReached: int('floors_reached').notNull().default(1),
  enemiesKilled: int('enemies_killed').notNull().default(0),
  killedBy: text('killed_by'),
  createdAt: int('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});
