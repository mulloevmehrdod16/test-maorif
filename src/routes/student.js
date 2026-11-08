import express from 'express';

export const directorRouter = express.Router();

directorRouter.get('/overview', (_req, res) => {
  res.json({
    dashboard: 'Director dashboard',
    school: 'Шаҳри Istiklol Мактаби 1',
    upcomingTasks: ['Review grade corrections', 'Approve attendance changes']
  });
});
