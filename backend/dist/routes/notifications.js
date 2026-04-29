"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationService_1 = require("../services/notificationService");
const router = (0, express_1.Router)();
const getUser = (req) => req.user;
// GET /api/notifications
router.get('/', async (req, res) => {
    try {
        const user = getUser(req);
        const notifications = await notificationService_1.notificationService.getUnread(user.id);
        const unreadCount = notifications.filter((n) => !n.read).length;
        res.json({ notifications, unreadCount });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
// PUT /api/notifications/read-all
router.put('/read-all', async (req, res) => {
    try {
        const user = getUser(req);
        await notificationService_1.notificationService.markRead(user.id);
        res.json({ message: 'All notifications marked as read' });
    }
    catch {
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
});
// PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
    try {
        const user = getUser(req);
        await notificationService_1.notificationService.markRead(user.id, req.params.id);
        res.json({ message: 'Notification marked as read' });
    }
    catch {
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});
exports.default = router;
//# sourceMappingURL=notifications.js.map