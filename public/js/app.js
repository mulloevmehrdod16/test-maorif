:root {
  --navy: #0f2747;
  --navy-2: #163c66;
  --blue: #1a6cad;
  --turquoise: #5cc7d8;
  --gold: #d9b36c;
  --white: #ffffff;
  --ink: #16314a;
  --soft: #eef5fb;
  --gray: #6b7b8c;
  --line: #dfeaf5;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: var(--soft);
  color: var(--ink);
}

a { color: inherit; text-decoration: none; }
button, select {
  font: inherit;
}

.container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.topbar {
  background: linear-gradient(90deg, var(--navy), var(--navy-2));
  color: var(--white);
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  gap: 24px;
}

.brand {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.main-nav {
  display: flex;
  gap: 20px;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.08);
  color: var(--white);
}

button.primary, button.secondary {
  border: none;
  border-radius: 999px;
  padding: 12px 18px;
  cursor: pointer;
  font-weight: 600;
}

button.primary {
  background: linear-gradient(135deg, var(--gold), #ebd6a6);
  color: var(--navy);
}

button.secondary {
  background: transparent;
  color: var(--navy);
  border: 1px solid var(--line);
}

.hero {
  background: linear-gradient(135deg, rgba(16,39,71,0.97), rgba(26,108,173,0.9));
  color: var(--white);
  padding: 72px 0 48px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 32px;
  align-items: center;
}

.eyebrow {
  display: inline-block;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.8;
  margin-bottom: 12px;
}

h1 {
  font-size: clamp(2.5rem, 5vw, 4.3rem);
  line-height: 1.1;
  margin: 0 0 16px;
}

.hero p {
  color: rgba(255,255,255,0.84);
  font-size: 1.05rem;
  max-width: 650px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.stats-card {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(4px);
}

.stats-list {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding: 10px 0;
}

.section {
  padding: 54px 0;
}
.section.alt {
  background: #f4f8fc;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 12px 26px rgba(20, 45, 74, 0.06);
}

.card h3, .card h4 {
  margin-top: 0;
  margin-bottom: 10px;
}

.card p {
  color: var(--gray);
  margin-bottom: 0;
}

.card-list {
  display: grid;
  gap: 14px;
}

.footer {
  background: var(--navy);
  color: var(--white);
  padding: 40px 0 56px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
}

@media (max-width: 860px) {
  .main-nav { display: none; }
  .hero-grid, .card-grid, .footer-grid {
    grid-template-columns: 1fr;
  }
}
