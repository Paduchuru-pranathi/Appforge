"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const database_1 = require("../config/database");
const notificationService_1 = require("../services/notificationService");
const router = (0, express_1.Router)();
function generateToken(id, email) {
    return jsonwebtoken_1.default.sign({ id, email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
}
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'skip') {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    }, async (_at, _rt, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            if (!email)
                return done(new Error('No email from Google'));
            let result = await database_1.pool.query('SELECT * FROM users WHERE google_id = $1 OR email = $2', [profile.id, email]);
            let user = result.rows[0];
            if (!user) {
                result = await database_1.pool.query('INSERT INTO users (email, google_id, name, avatar) VALUES ($1, $2, $3, $4) RETURNING *', [email, profile.id, profile.displayName, profile.photos?.[0]?.value]);
                user = result.rows[0];
                await notificationService_1.notificationService.create(user.id, null, 'welcome', 'Welcome to AppForge!', 'Start building your first app.');
            }
            else if (!user.google_id) {
                await database_1.pool.query('UPDATE users SET google_id = $1 WHERE id = $2', [profile.id, user.id]);
            }
            return done(null, user);
        }
        catch (error) {
            return done(error);
        }
    }));
}
passport_1.default.serializeUser((user, done) => done(null, user.id));
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const result = await database_1.pool.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, result.rows[0] || null);
    }
    catch (err) {
        done(err);
    }
});
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }
    try {
        const existing = await database_1.pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
        if (existing.rows.length > 0) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }
        const hash = await bcryptjs_1.default.hash(password, 12);
        const result = await database_1.pool.query('INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at', [email.toLowerCase(), hash, name || email.split('@')[0]]);
        const user = result.rows[0];
        const token = generateToken(user.id, user.email);
        await notificationService_1.notificationService.create(user.id, null, 'welcome', 'Welcome to AppForge!', 'Start building.');
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    try {
        const result = await database_1.pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
        const user = result.rows[0];
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        if (!user.password_hash) {
            res.status(401).json({ error: 'Please login with Google' });
            return;
        }
        const valid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!valid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const token = generateToken(user.id, user.email);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const result = await database_1.pool.query('SELECT id, email, name, avatar, created_at FROM users WHERE id = $1', [userId]);
        if (!result.rows[0]) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
router.get('/google', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'skip') {
        res.status(400).json({ error: 'Google OAuth not configured' });
        return;
    }
    passport_1.default.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});
router.get('/google/callback', passport_1.default.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` }), (req, res) => {
    const user = req.user;
    const token = generateToken(user.id, user.email);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});
exports.default = router;
//# sourceMappingURL=auth.js.map