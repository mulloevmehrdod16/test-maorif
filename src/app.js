import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { publicRouter } from './routes/public.js';
import { adminRouter } from './routes/admin.js';
import { directorRouter } from './routes/director.js';
import { studentRouter } from './routes/student.js';

dotenv.config();

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: process.env.APP_URL || false }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));
  app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false }));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'MAORIF ISTIKLOL' }));
  app.use('/api/auth', authRouter);
  app.use('/api/public', publicRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/director', directorRouter);
  app.use('/api/student', studentRouter);
  app.use(express.static('public'));
  app.get('*', (req, res) => req.path.startsWith('/api/') ? res.status(404).json({ error: 'Endpoint not found' }) : res.sendFile('index.html', { root: 'public' }));
  app.use((err, _req, res, _next) => {
    console.error('Unhandled request error:', err.message);
    res.status(500).json({ error: 'An unexpected server error occurred.' });
  });
  return app;
}
