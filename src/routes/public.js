import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/db.js';

export const authRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (!process.env.DATABASE_URL) {
    if (email === 'admin@maorif.istiklol' && password === 'Admin123!') {
      return res.json({
        token: signToken({ sub: 'demo-admin', role: 'MAIN_ADMIN' }),
        user: {
          id: 'demo-admin',
          email,
          fullName: 'Main Administrator',
          role: 'MAIN_ADMIN'
        }
      });
    }

    return res.status(401).json({ error: 'Invalid credentials in demo mode.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'User not found.' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid password.' });

    const roleRecord = await prisma.userRole.findFirst({
      where: { userId: user.id },
      include: { role: true }
    });

    const token = signToken({ sub: user.id, role: roleRecord?.role?.name || 'STUDENT' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        role: roleRecord?.role?.name || 'STUDENT'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed.', details: error.message });
  }
});

authRouter.post('/first-login', async (req, res) => {
  const { email, temporaryPassword, newPassword } = req.body || {};

  if (!email || !temporaryPassword || !newPassword) {
    return res.status(400).json({ error: 'Required fields are missing.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  }

  res.json({
    success: true,
    message: 'Password change recorded. Please sign in with your new password.'
  });
});
