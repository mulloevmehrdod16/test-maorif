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

  app.use(helmet({
    crossOriginResourcePolicy: false
  }));
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      app: 'MAORIF ISTIKLOL',
      databaseConfigured: Boolean(process.env.DATABASE_URL)
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/public', publicRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/director', directorRouter);
  app.use('/api/student', studentRouter);

  app.use(express.static('public'));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.sendFile('index.html', { root: 'public' });
  });

  return app;
}
