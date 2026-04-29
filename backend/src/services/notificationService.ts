/// <reference lib="dom" />
import { pool } from '../config/database';

class NotificationService {
  async create(
    userId: string,
    appId: string | null,
    type: string,
    title: string,
    message?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO notifications (user_id, app_id, type, title, message, metadata)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, appId, type, title, message || null, JSON.stringify(metadata || {})]
      );
    } catch (error) {
      console.error('Failed to create notification:', error);
      // Non-blocking — notifications should never break the main flow
    }
  }

  async getUnread(userId: string): Promise<any[]> {
    try {
      const result = await pool.query(
        `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
        [userId]
      );
      return result.rows;
    } catch {
      return [];
    }
  }

  async markRead(userId: string, notificationId?: string): Promise<void> {
    try {
      if (notificationId) {
        await pool.query(
          `UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2`,
          [notificationId, userId]
        );
      } else {
        await pool.query(
          `UPDATE notifications SET read = true WHERE user_id = $1`,
          [userId]
        );
      }
    } catch (error) {
      console.error('Failed to mark notifications read:', error);
    }
  }

  async triggerEvent(userId: string, appId: string, event: string, data?: Record<string, any>): Promise<void> {
    const messages: Record<string, { title: string; message: string }> = {
      record_created: { title: 'Record Created', message: 'A new record was added to your app.' },
      record_updated: { title: 'Record Updated', message: 'A record was updated in your app.' },
      record_deleted: { title: 'Record Deleted', message: 'A record was removed from your app.' },
      app_published: { title: 'App Published 🚀', message: 'Your app is now live!' },
      app_created: { title: 'App Created ✨', message: 'Your new app has been created successfully.' },
    };

    const msg = messages[event] || { title: event, message: `Event triggered: ${event}` };
    await this.create(userId, appId, event, msg.title, msg.message, data);
  }
}

export const notificationService = new NotificationService();
