import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { leaderboardRoutes } from './routes/leaderboard';
import { runsRoutes } from './routes/runs';

const app = new Hono();

app.use('*', cors());

app.get('/api/health', (c) => c.json({ status: 'ok' }));

app.route('/api/leaderboard', leaderboardRoutes);
app.route('/api/runs', runsRoutes);

export default {
  port: 3001,
  fetch: app.fetch,
};
