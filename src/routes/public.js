import express from 'express';
import { prisma } from '../lib/db.js';

export const publicRouter = express.Router();

const messages = {
  tg: { brand: 'МАОРИФ ИСТИКЛОЛ', heroTitle: 'Маориф — сармояи ояндаи мо', heroSubtitle: 'Портали ягонаи соҳаи маорифи шаҳри Истиқлол.', news: 'Хабарҳои охирин', announcements: 'Эълонҳо', schools: 'Муассисаҳои таълимӣ', stats: 'Маълумоти оморӣ', read: 'Муфассал', empty: 'Маълумот ҳоло дастрас нест.' },
  ru: { brand: 'МАОРИФ ИСТИКЛОЛ', heroTitle: 'Образование — наше будущее', heroSubtitle: 'Единый образовательный портал города Истиклол.', news: 'Последние новости', announcements: 'Объявления', schools: 'Образовательные учреждения', stats: 'Статистика', read: 'Подробнее', empty: 'Информация пока недоступна.' },
  en: { brand: 'MAORIF ISTIKLOL', heroTitle: 'Education is our future', heroSubtitle: 'The unified education portal for the city of Istiklol.', news: 'Latest news', announcements: 'Announcements', schools: 'Education institutions', stats: 'Statistics', read: 'Learn more', empty: 'Information is not available yet.' }
};

publicRouter.get('/home', async (req, res) => {
  const lang = ['tg', 'ru', 'en'].includes(String(req.query.lang)) ? String(req.query.lang) : 'tg';
  try {
    const [schools, students, teachers, news, announcements] = await Promise.all([
      prisma.school.count({ where: { status: 'ACTIVE' } }),
      prisma.student.count({ where: { status: 'ACTIVE' } }),
      prisma.teacher.count(),
      prisma.news.findMany({ where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } }, orderBy: { publishedAt: 'desc' }, take: 3, select: { id: true, title: true, slug: true, publishedAt: true } }),
      prisma.announcement.findMany({ where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } }, orderBy: { publishedAt: 'desc' }, take: 4, select: { id: true, title: true, content: true, publishedAt: true } })
    ]);
    res.json({ brand: messages[lang].brand, hero: { title: messages[lang].heroTitle, subtitle: messages[lang].heroSubtitle }, labels: messages[lang], stats: [{ label: lang === 'tg' ? 'Мактабҳо' : lang === 'ru' ? 'Школы' : 'Schools', value: schools }, { label: lang === 'tg' ? 'Хонандагон' : lang === 'ru' ? 'Учащиеся' : 'Students', value: students }, { label: lang === 'tg' ? 'Омӯзгорон' : lang === 'ru' ? 'Учителя' : 'Teachers', value: teachers }], news, announcements });
  } catch {
    res.status(503).json({ error: 'Public information is temporarily unavailable.' });
  }
});

publicRouter.get('/schools', async (_req, res) => {
  try {
    const items = await prisma.school.findMany({ where: { status: 'ACTIVE' }, select: { id: true, name: true, shortName: true, city: true, address: true, website: true }, orderBy: { name: 'asc' } });
    res.json({ items });
  } catch { res.status(503).json({ error: 'Public information is temporarily unavailable.' }); }
});

publicRouter.get('/schools/:id', async (req, res) => {
  try {
    const school = await prisma.school.findFirst({ where: { id: req.params.id, status: 'ACTIVE' }, select: { id: true, name: true, shortName: true, city: true, address: true, phone: true, email: true, website: true } });
    if (!school) return res.status(404).json({ error: 'School not found.' });
    res.json({ school });
  } catch { res.status(503).json({ error: 'Public information is temporarily unavailable.' }); }
});

publicRouter.get('/translations/:lang', (req, res) => {
  const lang = ['tg', 'ru', 'en'].includes(req.params.lang) ? req.params.lang : 'tg';
  res.json({ lang, translations: messages[lang] });
});
