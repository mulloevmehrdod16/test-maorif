import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db.js';

function jwtSecret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error('JWT_SECRET is not configured');
  return value;
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
  try {
    const payload = jwt.verify(header.slice(7), jwtSecret(), { issuer: 'maorif-istiklol' });
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, include: { roles: { include: { role: true } } } });
    if (!user || user.deletedAt || (!user.isActive && !user.mustChangePassword)) return res.status(401).json({ error: 'Account is unavailable.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

export function authorizeRoles(...allowed) {
  return (req, res, next) => {
    const roles = req.user?.roles?.map((item) => item.role.name) || [];
    if (!allowed.some((role) => roles.includes(role))) return res.status(403).json({ error: 'You do not have permission to access this resource.' });
    next();
  };
}
