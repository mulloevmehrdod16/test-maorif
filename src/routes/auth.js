import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = express.Router();
const secret = () => {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error('JWT_SECRET must be set to at least 32 characters.');
  return value;
};

function issueToken(user, role) {
  return jwt.sign({ sub: user.id }, secret(), { expiresIn: '8h', issuer: 'maorif-istiklol' });
}

authRouter.post('/login', async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!email || !password || email.length > 254 || password.length > 200) return res.status(400).json({ error: 'Enter your login and password.' });
  try {
    const user = await prisma.user.findUnique({ where: { email }, include: { roles: { include: { role: true } } } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ error: 'Login or password is incorrect.' });
    if (!user.isActive && !user.mustChangePassword) return res.status(403).json({ error: 'This account is inactive.' });
    const role = user.roles[0]?.role?.name;
    if (!role) return res.status(403).json({ error: 'No role is assigned to this account.' });
    if (user.mustChangePassword) return res.json({ requiresPasswordChange: true, firstLoginToken: issueToken(user, role), role });
    if (!user.isActive) return res.status(403).json({ error: 'This account is inactive.' });
    res.json({ token: issueToken(user, role), user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role } });
  } catch (error) {
    if (error.message.includes('JWT_SECRET')) return res.status(500).json({ error: 'Authentication is not configured.' });
    res.status(503).json({ error: 'Authentication service is unavailable.' });
  }
});

authRouter.post('/first-login', requireAuth, async (req, res) => {
  const password = req.body?.newPassword;
  if (typeof password !== 'string' || password.length < 12 || password.length > 200) return res.status(400).json({ error: 'Choose a password with at least 12 characters.' });
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user?.mustChangePassword) return res.status(409).json({ error: 'Password change is not required for this account.' });
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(password, 12), mustChangePassword: false, isActive: true } });
      await tx.auditLog.create({ data: { actorId: user.id, action: 'FIRST_LOGIN_PASSWORD_CHANGED', entity: 'User', entityId: user.id } });
    });
    res.json({ success: true, message: 'Password updated. Sign in with your new password.' });
  } catch {
    res.status(500).json({ error: 'Could not update password.' });
  }
});

authRouter.get('/me', requireAuth, async (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, roles: req.user.roles.map(({ role }) => role.name), schoolId: req.user.schoolId, mustChangePassword: req.user.mustChangePassword } });
});

authRouter.post('/logout', requireAuth, (_req, res) => res.json({ success: true, message: 'Sign out and remove the saved token from this device.' }));
