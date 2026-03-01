import { Hono } from 'hono';

export const runsRoutes = new Hono();

// POST /api/runs — save a completed run
runsRoutes.post('/', async (c) => {
  return c.json({ message: 'not yet implemented' }, 501);
});
