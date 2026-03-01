import { Hono } from 'hono';

export const leaderboardRoutes = new Hono();

// GET /api/leaderboard — top 10 runs by score
leaderboardRoutes.get('/', async (c) => {
  return c.json({ message: 'not yet implemented' }, 501);
});
