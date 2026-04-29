import { Router, Request, Response } from 'express';
import { notificationService } from '../services/notificationService';

const router = Router();

const getUser = (req: Request) => (req as any).user as { id: string; email: string };

// GET /api/notifications
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = getUser(req);
    const notifications = await notificationService.getUnread(user.id);
    const unreadCount = notifications.filter((n: any) => !n.read).length;
    res.json({ notifications, unreadCount });
  } catch { res.status(500).json({ error: 'Failed to fetch notifications' }); }
});

// PUT /api/notifications/read-all
router.put('/read-all', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = getUser(req);
    await notificationService.markRead(user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch { res.status(500).json({ error: 'Failed to mark notifications as read' }); }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = getUser(req);
    await notificationService.markRead(user.id, req.params.id);
    res.json({ message: 'Notification marked as read' });
  } catch { res.status(500).json({ error: 'Failed to mark notification as read' }); }
});

export default router;
