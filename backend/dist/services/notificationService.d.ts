declare class NotificationService {
    create(userId: string, appId: string | null, type: string, title: string, message?: string, metadata?: Record<string, any>): Promise<void>;
    getUnread(userId: string): Promise<any[]>;
    markRead(userId: string, notificationId?: string): Promise<void>;
    triggerEvent(userId: string, appId: string, event: string, data?: Record<string, any>): Promise<void>;
}
export declare const notificationService: NotificationService;
export {};
//# sourceMappingURL=notificationService.d.ts.map