import express from 'express';

export const studentRouter = express.Router();

studentRouter.get('/overview', (_req, res) => {
  res.json({
    dashboard: 'Student dashboard',
    name: 'Мирзоев Салим',
    className: '7-A',
    averageGrade: 4.8,
    attendance: 97.4,
    behaviorPoints: 12
  });
});
