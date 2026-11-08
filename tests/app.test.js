const defaults = {
  tg: {
    siteName: 'МАОРИФ ИСТИКЛОЛ',
    heroTitle: 'Маориф ва фарҳанги оянда',
    heroSubtitle: 'Платформаи ягонаи маориф, идоракунии мактабҳо, журналҳои электронӣ ва маълумоти оммавӣ.'
  },
  ru: {
    siteName: 'МАОРИФ ИСТИКЛОЛ',
    heroTitle: 'Образование и будущее города',
    heroSubtitle: 'Единая платформа образования, управления школами, электронным журналом и общественной информацией.'
  },
  en: {
    siteName: 'MAORIF ISTIKLOL',
    heroTitle: 'Education for the future',
    heroSubtitle: 'A unified education platform for school management, electronic journals, and public information.'
  }
};

async function loadHomeData(language = 'tg') {
  const response = await fetch(`/api/public/home?lang=${language}`);
  const data = await response.json();
  document.getElementById('hero-title').textContent = data.hero.title;
  document.getElementById('hero-subtitle').textContent = data.hero.subtitle;
  const statsList = document.getElementById('stats-list');
  statsList.innerHTML = data.stats.map((stat) => `
    <div class="stat-item">
      <span>${stat.label}</span>
      <strong>${stat.value}</strong>
    </div>
  `).join('');

  const newsList = document.getElementById('news-list');
  newsList.innerHTML = data.news.map((item) => `
    <article class="card">
      <h3>${item.title}</h3>
      <p>${item.slug}</p>
    </article>
  `).join('');

  const announcementsList = document.getElementById('announcements-list');
  announcementsList.innerHTML = data.announcements.map((item) => `
    <div class="card">
      <h4>${item.title}</h4>
      <p>${item.date}</p>
    </div>
  `).join('');
}

const switcher = document.getElementById('language-switcher');
switcher.addEventListener('change', async (event) => {
  await loadHomeData(event.target.value);
});

loadHomeData('tg');
