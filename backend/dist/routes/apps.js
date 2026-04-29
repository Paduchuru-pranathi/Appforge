"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const configValidator_1 = require("../utils/configValidator");
const notificationService_1 = require("../services/notificationService");
const router = (0, express_1.Router)();
const getUser = (req) => req.user;
// GET /api/apps
router.get('/', async (req, res) => {
    try {
        const user = getUser(req);
        const result = await database_1.pool.query('SELECT id, name, slug, config, published, created_at, updated_at FROM apps WHERE user_id = $1 ORDER BY updated_at DESC', [user.id]);
        res.json(result.rows);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch apps' });
    }
});
// POST /api/apps
router.post('/', async (req, res) => {
    try {
        const user = getUser(req);
        const rawConfig = req.body.config || req.body;
        const { config, warnings } = (0, configValidator_1.validateAndNormalizeConfig)(rawConfig);
        const baseSlug = config.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'app';
        const slug = `${baseSlug}-${Date.now().toString(36)}`;
        const result = await database_1.pool.query('INSERT INTO apps (user_id, name, slug, config) VALUES ($1, $2, $3, $4) RETURNING *', [user.id, config.name, slug, JSON.stringify(config)]);
        const app = result.rows[0];
        await notificationService_1.notificationService.triggerEvent(user.id, app.id, 'app_created');
        res.status(201).json({ app, warnings });
    }
    catch (error) {
        if (error.code === '23505') {
            res.status(409).json({ error: 'App already exists' });
        }
        else {
            console.error(error);
            res.status(500).json({ error: 'Failed to create app' });
        }
    }
});
// GET /api/apps/:id
router.get('/:id', async (req, res) => {
    try {
        const user = getUser(req);
        const result = await database_1.pool.query('SELECT * FROM apps WHERE id = $1 AND user_id = $2', [req.params.id, user.id]);
        if (!result.rows[0]) {
            res.status(404).json({ error: 'App not found' });
            return;
        }
        res.json(result.rows[0]);
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch app' });
    }
});
// PUT /api/apps/:id
router.put('/:id', async (req, res) => {
    try {
        const user = getUser(req);
        const rawConfig = req.body.config || req.body;
        const { config, warnings } = (0, configValidator_1.validateAndNormalizeConfig)(rawConfig);
        const result = await database_1.pool.query('UPDATE apps SET config = $1, name = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *', [JSON.stringify(config), config.name, req.params.id, user.id]);
        if (!result.rows[0]) {
            res.status(404).json({ error: 'App not found' });
            return;
        }
        res.json({ app: result.rows[0], warnings });
    }
    catch {
        res.status(500).json({ error: 'Failed to update app' });
    }
});
// DELETE /api/apps/:id
router.delete('/:id', async (req, res) => {
    try {
        const user = getUser(req);
        const result = await database_1.pool.query('DELETE FROM apps WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, user.id]);
        if (!result.rows[0]) {
            res.status(404).json({ error: 'App not found' });
            return;
        }
        res.json({ message: 'App deleted' });
    }
    catch {
        res.status(500).json({ error: 'Failed to delete app' });
    }
});
// POST /api/apps/:id/publish
router.post('/:id/publish', async (req, res) => {
    try {
        const user = getUser(req);
        const result = await database_1.pool.query('UPDATE apps SET published = NOT published, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, user.id]);
        if (!result.rows[0]) {
            res.status(404).json({ error: 'App not found' });
            return;
        }
        const app = result.rows[0];
        if (app.published)
            await notificationService_1.notificationService.triggerEvent(user.id, app.id, 'app_published');
        res.json(app);
    }
    catch {
        res.status(500).json({ error: 'Failed to publish app' });
    }
});
exports.default = router;
//# sourceMappingURL=apps.js.map