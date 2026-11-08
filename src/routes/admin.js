import express from 'express';

export const publicRouter = express.Router();

const translations = {
  tg: {
    siteName: 'МАОРИФ ИСТИКЛОЛ',
    heroTitle: 'Маориф ва фарҳанги оянда',
    heroSubtitle: 'Платформаи ягонаи маориф, идоракунии мактабҳо, журналҳои электронӣ ва маълумоти оммавӣ.',
    news: 'Ахборҳои охирин',
    announcements: 'Эълонҳо'
  },
  ru: {
    siteName: 'МАОРИФ ИСТИКЛОЛ',
    heroTitle: 'Образование и будущее города',
    heroSubtitle: 'Единая платформа образования, управления школами, электронным журналом и общественной информацией.',
    news: 'Последние новости',
    announcements: 'Объявления'
  },
  en: {
    siteName: 'MAORIF ISTIKLOL',
    heroTitle: 'Education for the future',
    heroSubtitle: 'A unified education platform for school management, electronic journals, and public information.',
    news: 'Latest news',
    announcements: 'Announcements'
  }
};

publicRouter.get('/home', (_req, res) => {
  const language = (_req.query.lang || 'tg').toLowerCase();
  const content = translations[language] || translations.tg;

  res.json({
    brand: content.siteName,
    hero: {
      title: content.heroTitle,
      subtitle: content.heroSubtitle
    },
    stats: [
      { label: 'Школа', value: '36' },
      { label: 'Мактабҳо', value: '36' },
      { label: 'Муаллимон', value: '2140' },
      { label: 'Шакогӣ', value: '19832' }
    ],
    news: [
      { id: 1, title: 'Системаи навини маориф оғоз ёфт', slug: 'sistemai-novini-maorif' },
      { id: 2, title: 'Такмили электронӣ дар мактабҳо', slug: 'takmili-elektroni-dar-maktabho' }
    ],
    announcements: [
      { id: 1, title: 'Басямӣ аз барномавӣ', date: '2026-11-08' },
      { id: 2, title: 'Рӯзномаи имтиҳонҳои соли нав', date: '2026-11-15' }
    ],
    language: language
  });
});

publicRouter.get('/translations/:lang', (req, res) => {
  const lang = req.params.lang || 'tg';
  res.json({
    lang,
    translations: translations[lang] || translations.tg
  });
});

publicRouter.get('/schools', (_req, res) => {
  res.json({
    items: [
      { id: 'school-1', name: 'Шаҳри Istiklol Мактаби 1', city: 'Истиқлол' },
      { id: 'school-2', name: 'Шаҳри Istiklol Мактаби 2', city: 'Истиқлол' }
    ]
  });
});

publicRouter.get('/statistics', (_req, res) => {
  res.json({
    totalSchools: 36,
    totalStudents: 19832,
    totalTeachers: 2140,
    attendanceRate: 96.7,
    averagePerformance: 4.5
  });
});
