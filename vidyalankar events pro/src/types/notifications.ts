export interface NotificationData {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  data?: Record<string, any>;
  created_at: string;
  read_at?: string;
}

export type NotificationType = 
  | 'event_update'
  | 'event_reminder'
  | 'event_registration'
  | 'event_cancellation'
  | 'event_approval'
  | 'forum_reply'
  | 'forum_mention'
  | 'system';

export type NotificationStatus = 'unread' | 'read';

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  event_updates: boolean;
  event_reminders: boolean;
  forum_notifications: boolean;
  system_notifications: boolean;
}

// Re-export NotificationData as Notification for backward compatibility
export type Notification = NotificationData;