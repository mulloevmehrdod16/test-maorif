import express from 'express';

export const adminRouter = express.Router();

adminRouter.get('/overview', (_req, res) => {
  res.json({
    dashboard: 'Main admin dashboard',
    stats: {
      schools: 36,
      students: 19832,
      teachers: 2140,
      classes: 480
    },
    recentActivities: [
      'New school added',
      'Director credentials issued',
      'Academic year updated'
    ]
  });
});

adminRouter.get('/schools', (_req, res) => {
  res.json({
    items: [{ id: 'school-1', name: 'Шаҳри Istiklol Мактаби 1', city: 'Истиқлол' }]
  });
});
