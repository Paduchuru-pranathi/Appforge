import { Router, Request, Response } from 'express';
import { pool } from '../config/database';
import { notificationService } from '../services/notificationService';

const router = Router();

const getUser = (req: Request) => (req as any).user as { id: string; email: string };

async function verifyOwnership(appId: string, userId: string): Promise<boolean> {
  const result = await pool.query('SELECT id FROM apps WHERE id = $1 AND user_id = $2', [appId, userId]);
  return result.rows.length > 0;
}

// GET /api/data/:appId/:collection
router.get('/:appId/:collection', async (req: Request, res: Response): Promise<void> => {
  const { appId, collection } = req.params;
  try {
    const user = getUser(req);
    const isOwner = await verifyOwnership(appId, user.id);
    if (!isOwner) { res.status(403).json({ error: 'Access denied' }); return; }

    const { page = '1', limit = '50', search } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 50));
    const offset = (pageNum - 1) * limitNum;

    let query = 'SELECT id, data, created_at, updated_at FROM app_data WHERE app_id = $1 AND user_id = $2 AND collection = $3';
    const params: any[] = [appId, user.id, collection];

    if (search && typeof search === 'string') {
      params.push(`%${search}%`);
      query += ` AND data::text ILIKE $${params.length}`;
    }

    const countResult = await pool.query(query.replace('SELECT id, data, created_at, updated_at', 'SELECT COUNT(*)'), params);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limitNum, offset);

    const result = await pool.query(query, params);
    res.json({
      data: result.rows.map(row => ({ id: row.id, ...row.data, _createdAt: row.created_at, _updatedAt: row.updated_at })),
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch data' }); }
});

// POST /api/data/:appId/:collection
router.post('/:appId/:collection', async (req: Request, res: Response): Promise<void> => {
  const { appId, collection } = req.params;
  try {
    const user = getUser(req);
    const isOwner = await verifyOwnership(appId, user.id);
    if (!isOwner) { res.status(403).json({ error: 'Access denied' }); return; }

    const { id: _id, _createdAt, _updatedAt, ...data } = req.body;
    if (!data || Object.keys(data).length === 0) { res.status(400).json({ error: 'Record data cannot be empty' }); return; }

    const result = await pool.query(
      'INSERT INTO app_data (app_id, user_id, collection, data) VALUES ($1, $2, $3, $4) RETURNING *',
      [appId, user.id, collection, JSON.stringify(data)]
    );
    const row = result.rows[0];
    await notificationService.triggerEvent(user.id, appId, 'record_created', { collection });
    res.status(201).json({ id: row.id, ...row.data, _createdAt: row.created_at, _updatedAt: row.updated_at });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to create record' }); }
});

// GET /api/data/:appId/:collection/:id
router.get('/:appId/:collection/:id', async (req: Request, res: Response): Promise<void> => {
  const { appId, collection, id } = req.params;
  try {
    const user = getUser(req);
    const isOwner = await verifyOwnership(appId, user.id);
    if (!isOwner) { res.status(403).json({ error: 'Access denied' }); return; }

    const result = await pool.query(
      'SELECT * FROM app_data WHERE id = $1 AND app_id = $2 AND collection = $3 AND user_id = $4',
      [id, appId, collection, user.id]
    );
    if (!result.rows[0]) { res.status(404).json({ error: 'Record not found' }); return; }
    const row = result.rows[0];
    res.json({ id: row.id, ...row.data, _createdAt: row.created_at, _updatedAt: row.updated_at });
  } catch { res.status(500).json({ error: 'Failed to fetch record' }); }
});

// PUT /api/data/:appId/:collection/:id
router.put('/:appId/:collection/:id', async (req: Request, res: Response): Promise<void> => {
  const { appId, collection, id } = req.params;
  try {
    const user = getUser(req);
    const isOwner = await verifyOwnership(appId, user.id);
    if (!isOwner) { res.status(403).json({ error: 'Access denied' }); return; }

    const { id: _id, _createdAt, _updatedAt, ...data } = req.body;
    const result = await pool.query(
      'UPDATE app_data SET data = $1, updated_at = NOW() WHERE id = $2 AND app_id = $3 AND collection = $4 AND user_id = $5 RETURNING *',
      [JSON.stringify(data), id, appId, collection, user.id]
    );
    if (!result.rows[0]) { res.status(404).json({ error: 'Record not found' }); return; }
    const row = result.rows[0];
    await notificationService.triggerEvent(user.id, appId, 'record_updated', { collection });
    res.json({ id: row.id, ...row.data, _createdAt: row.created_at, _updatedAt: row.updated_at });
  } catch { res.status(500).json({ error: 'Failed to update record' }); }
});

// DELETE /api/data/:appId/:collection/:id
router.delete('/:appId/:collection/:id', async (req: Request, res: Response): Promise<void> => {
  const { appId, collection, id } = req.params;
  try {
    const user = getUser(req);
    const isOwner = await verifyOwnership(appId, user.id);
    if (!isOwner) { res.status(403).json({ error: 'Access denied' }); return; }

    const result = await pool.query(
      'DELETE FROM app_data WHERE id = $1 AND app_id = $2 AND collection = $3 AND user_id = $4 RETURNING id',
      [id, appId, collection, user.id]
    );
    if (!result.rows[0]) { res.status(404).json({ error: 'Record not found' }); return; }
    await notificationService.triggerEvent(user.id, appId, 'record_deleted', { collection });
    res.json({ message: 'Record deleted' });
  } catch { res.status(500).json({ error: 'Failed to delete record' }); }
});

export default router;
