import express from 'express';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { prisma } from '../lib/db.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.js';

export const adminRouter = express.Router();
adminRouter.use(requireAuth, authorizeRoles('MAIN_ADMIN'));

function temporaryPassword() {
  return randomBytes(18).toString('base64url');
}

function loginId() {
  return `director.${randomBytes(6).toString('hex')}@login.maorif.istiklol`;
}

adminRouter.get('/overview', async (_req, res) => {
  try {
    const [schools, students, teachers, classes] = await Promise.all([
      prisma.school.count({ where: { status: 'ACTIVE' } }),
      prisma.student.count({ where: { status: 'ACTIVE' } }),
      prisma.teacher.count(),
      prisma.class.count()
    ]);
    res.json({ stats: { schools, students, teachers, classes } });
  } catch {
    res.status(503).json({ error: 'Database is unavailable.' });
  }
});

adminRouter.get('/schools', async (_req, res) => {
  try {
    const items = await prisma.school.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, shortName: true, city: true, address: true, status: true, _count: { select: { students: true, teachers: true, classes: true } } }
    });
    res.json({ items });
  } catch {
    res.status(503).json({ error: 'Database is unavailable.' });
  }
});

adminRouter.post('/schools', async (req, res) => {
  const { name, shortName, city, address, phone, email } = req.body || {};
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 160) {
    return res.status(400).json({ error: 'School name must be between 2 and 160 characters.' });
  }
  try {
    const school = await prisma.$transaction(async (tx) => {
      const created = await tx.school.create({
        data: { name: name.trim(), shortName: shortName?.trim() || null, city: city?.trim() || 'Истиқлол', address: address?.trim() || null, phone: phone?.trim() || null, email: email?.trim() || null }
      });
      await tx.auditLog.create({ data: { actorId: req.user.id, action: 'SCHOOL_CREATED', entity: 'School', entityId: created.id, details: { name: created.name } } });
      return created;
    });
    res.status(201).json({ school });
  } catch {
    res.status(500).json({ error: 'Could not create school.' });
  }
});

adminRouter.post('/schools/:schoolId/directors', async (req, res) => {
  const { firstName, lastName, phone } = req.body || {};
  if (![firstName, lastName].every((v) => typeof v === 'string' && v.trim().length >= 1 && v.trim().length <= 80)) {
    return res.status(400).json({ error: 'First name and last name are required (maximum 80 characters each).' });
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const school = await tx.school.findUnique({ where: { id: req.params.schoolId } });
      if (!school) return { error: 'School not found.', status: 404 };
      if (await tx.director.findFirst({ where: { schoolId: school.id } })) return { error: 'This school already has a director.', status: 409 };
      const role = await tx.role.findUnique({ where: { name: 'DIRECTOR' } });
      if (!role) return { error: 'DIRECTOR role is missing; run the database seed first.', status: 503 };

      const email = loginId();
      const password = temporaryPassword();
      const user = await tx.user.create({ data: {
        email,
        passwordHash: await bcrypt.hash(password, 12),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: typeof phone === 'string' ? phone.trim() || null : null,
        schoolId: school.id,
        isActive: false,
        mustChangePassword: true,
        roles: { create: { roleId: role.id } },
        directorRelations: { create: { schoolId: school.id } }
      } });
      await tx.auditLog.create({ data: { actorId: req.user.id, action: 'DIRECTOR_ACCOUNT_CREATED', entity: 'User', entityId: user.id, details: { schoolId: school.id } } });
      return { credentials: { login: email, temporaryPassword: password }, director: { id: user.id, firstName: user.firstName, lastName: user.lastName, school: { id: school.id, name: school.name } } };
    });
    if (result.error) return res.status(result.status).json({ error: result.error });
    res.status(201).json(result);
  } catch {
    res.status(500).json({ error: 'Could not create director account.' });
  }
});
