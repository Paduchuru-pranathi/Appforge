/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../config/database';
import { notificationService } from '../services/notificationService';

const router = Router();

function generateToken(id: string, email: string): string {
  return jwt.sign({ id, email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' } as any);
}

function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) { res.status(401).json({ error: 'No token provided' }); return; }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'skip') {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
  }, async (_at: string, _rt: string, profile: any, done: any) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error('No email from Google'));
      let result = await pool.query('SELECT * FROM users WHERE google_id = $1 OR email = $2', [profile.id, email]);
      let user = result.rows[0];
      if (!user) {
        result = await pool.query(
          'INSERT INTO users (email, google_id, name, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
          [email, profile.id, profile.displayName, profile.photos?.[0]?.value]
        );
        user = result.rows[0];
        await notificationService.create(user.id, null, 'welcome', 'Welcome to AppForge!', 'Start building your first app.');
      } else if (!user.google_id) {
        await pool.query('UPDATE users SET google_id = $1 WHERE id = $2', [profile.id, user.id]);
      }
      return done(null, user);
    } catch (error) { return done(error); }
  }));
}

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0] || null);
  } catch (err) { done(err); }
});

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;
  if (!email || !password) { res.status(400).json({ error: 'Email and password are required' }); return; }
  if (password.length < 6) { res.status(400).json({ error: 'Password must be at least 6 characters' }); return; }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) { res.status(400).json({ error: 'Invalid email format' }); return; }
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) { res.status(409).json({ error: 'Email already registered' }); return; }
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email.toLowerCase(), hash, name || email.split('@')[0]]
    );
    const user = result.rows[0];
    const token = generateToken(user.id, user.email);
    await notificationService.create(user.id, null, 'welcome', 'Welcome to AppForge!', 'Start building.');
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) { console.error('Register error:', error); res.status(500).json({ error: 'Registration failed' }); }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ error: 'Email and password are required' }); return; }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];
    if (!user) { res.status(401).json({ error: 'Invalid email or password' }); return; }
    if (!user.password_hash) { res.status(401).json({ error: 'Please login with Google' }); return; }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) { res.status(401).json({ error: 'Invalid email or password' }); return; }
    const token = generateToken(user.id, user.email);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } });
  } catch (error) { console.error('Login error:', error); res.status(500).json({ error: 'Login failed' }); }
});

router.get('/me', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const result = await pool.query('SELECT id, email, name, avatar, created_at FROM users WHERE id = $1', [userId]);
    if (!result.rows[0]) { res.status(404).json({ error: 'User not found' }); return; }
    res.json(result.rows[0]);
  } catch { res.status(500).json({ error: 'Failed to fetch user' }); }
});

router.get('/google', (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'skip') {
    res.status(400).json({ error: 'Google OAuth not configured' }); return;
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = generateToken(user.id, user.email);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

export { authMiddleware };
export default router;
