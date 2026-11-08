import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: 'MAIN_ADMIN', description: 'City-wide platform administrator' },
    { name: 'DIRECTOR', description: 'School leader' },
    { name: 'CLASS_LEADER', description: 'Class manager' },
    { name: 'TEACHER', description: 'Subject teacher' },
    { name: 'STUDENT', description: 'Student account' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: { ...role }
    });
  }

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@maorif.istiklol' },
    update: {},
    create: {
      email: 'admin@maorif.istiklol',
      passwordHash: adminPassword,
      firstName: 'Main',
      lastName: 'Administrator',
      isActive: true,
      mustChangePassword: false
    }
  });

  const adminRole = await prisma.role.findUnique({ where: { name: 'MAIN_ADMIN' } });
  if (adminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id }
    });
  }

  const translations = [
    { key: 'site.name', language: 'tg', value: 'МАОРИФ ИСТИКЛОЛ' },
    { key: 'site.name', language: 'ru', value: 'МАОРИФ ИСТИКЛОЛ' },
    { key: 'site.name', language: 'en', value: 'MAORIF ISTIKLOL' },
    { key: 'nav.home', language: 'tg', value: 'Асосӣ' },
    { key: 'nav.home', language: 'ru', value: 'Главная' },
    { key: 'nav.home', language: 'en', value: 'Home' },
    { key: 'nav.education', language: 'tg', value: 'Маориф' },
    { key: 'nav.education', language: 'ru', value: 'Образование' },
    { key: 'nav.education', language: 'en', value: 'Education' },
    { key: 'nav.news', language: 'tg', value: 'Ахбор' },
    { key: 'nav.news', language: 'ru', value: 'Новости' },
    { key: 'nav.news', language: 'en', value: 'News' }
  ];

  for (const translation of translations) {
    await prisma.translation.upsert({
      where: {
        key_language: {
          key: translation.key,
          language: translation.language
        }
      },
      update: { value: translation.value },
      create: translation
    });
  }

  const school = await prisma.school.upsert({
    where: { id: 'demo-school' },
    update: {},
    create: {
      id: 'demo-school',
      name: 'Шаҳри Istiklol Мактаби 1',
      shortName: 'М1',
      city: 'Истиқлол',
      address: 'Шаҳри Истиқлол',
      email: 'school1@maorif.istiklol',
      status: 'ACTIVE'
    }
  });

  await prisma.systemSetting.upsert({
    where: { key: 'platform.name' },
    update: { value: 'MAORIF ISTIKLOL' },
    create: { key: 'platform.name', value: 'MAORIF ISTIKLOL' }
  });

  console.log('Seed data loaded successfully.');
  console.log('Demo admin credentials: admin@maorif.istiklol / Admin123!');
  console.log(`Demo school id: ${school.id}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
