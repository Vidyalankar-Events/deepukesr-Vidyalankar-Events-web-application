import { supabase } from '../lib/supabase';
import { NotificationData, NotificationType, NotificationPreferences } from '../types/notifications';

// Check if we're using mock data
const useMockData = () => {
  return !supabase.supabaseUrl.includes('supabase.co') || 
         supabase.supabaseUrl.includes('placeholder-project');
};

// Mock notifications for development
const mockNotifications: NotificationData[] = [
  {
    id: '1',
    user_id: 'mock-user-id',
    title: 'Event Registration Confirmed',
    message: 'Your registration for Tech Symposium 2025 has been confirmed.',
    type: 'event_registration',
    status: 'unread',
    data: {
      event_id: '1',
      event_name: 'Tech Symposium 2025'
    },
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'mock-user-id',
    title: 'Event Reminder',
    message: 'Cultural Fest starts in 30 minutes!',
    type: 'event_reminder',
    status: 'unread',
    data: {
      event_id: '2',
      event_name: 'Cultural Fest'
    },
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
];

const mockPreferences: NotificationPreferences = {
  id: '1',
  user_id: 'mock-user-id',
  email_enabled: true,
  push_enabled: true,
  event_updates: true,
  event_reminders: true,
  forum_notifications: true,
  system_notifications: true
};

// Service Worker Registration
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Push Notification Subscription
const subscribeToPushNotifications = async () => {
  try {
    const registration = await registerServiceWorker();
    if (!registration) return null;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
    });

    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
};

// Show browser notification
const showNotification = async (notification: NotificationData) => {
  if (!('Notification' in window)) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(notification.title, {
      body: notification.message,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: notification.data,
      vibrate: [200, 100, 200],
      tag: notification.id,
      actions: [
        {
          action: 'view',
          title: 'View'
        }
      ]
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};

export const notificationService = {
  // Subscribe to real-time notifications
  subscribeToNotifications: (callback: (notification: NotificationData) => void) => {
    if (useMockData()) {
      // For mock data, return a no-op unsubscribe function
      return {
        unsubscribe: () => {}
      };
    }

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${supabase.auth.user()?.id}`
        },
        async (payload) => {
          const notification = payload.new as NotificationData;
          callback(notification);
          // Show browser notification
          await showNotification(notification);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  },

  // Get user's notifications
  getNotifications: async (userId: string): Promise<NotificationData[]> => {
    if (useMockData()) {
      return mockNotifications;
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Get unread notification count
  getUnreadCount: async (userId: string): Promise<number> => {
    if (useMockData()) {
      return mockNotifications.filter(n => n.status === 'unread').length;
    }

    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'unread');

      if (error) {
        console.error('Error fetching unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<boolean> => {
    if (useMockData()) {
      const notification = mockNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.status = 'read';
        notification.read_at = new Date().toISOString();
        return true;
      }
      return false;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      return !error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: string): Promise<boolean> => {
    if (useMockData()) {
      mockNotifications.forEach(n => {
        if (n.user_id === userId) {
          n.status = 'read';
          n.read_at = new Date().toISOString();
        }
      });
      return true;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'unread');

      return !error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  },

  // Get notification preferences
  getPreferences: async (userId: string): Promise<NotificationPreferences | null> => {
    if (useMockData()) {
      return mockPreferences;
    }

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching notification preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return null;
    }
  },

  // Update notification preferences
  updatePreferences: async (
    userId: string,
    preferences: Partial<Omit<NotificationPreferences, 'id' | 'user_id'>>
  ): Promise<boolean> => {
    if (useMockData()) {
      Object.assign(mockPreferences, preferences);
      return true;
    }

    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences
        });

      return !error;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  },

  // Initialize push notifications
  initializePushNotifications: async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }

      const subscription = await subscribeToPushNotifications();
      if (!subscription) {
        console.log('Failed to subscribe to push notifications');
        return false;
      }

      // Store subscription on the server
      if (!useMockData()) {
        const { error } = await supabase
          .from('push_subscriptions')
          .upsert({
            user_id: supabase.auth.user()?.id,
            subscription: subscription
          });

        if (error) {
          console.error('Error storing push subscription:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    }
  },

  // Create a new notification
  createNotification: async (
    notification: Omit<NotificationData, 'id' | 'status' | 'created_at' | 'read_at'>
  ): Promise<boolean> => {
    if (useMockData()) {
      const newNotification = {
        id: String(mockNotifications.length + 1),
        status: 'unread',
        created_at: new Date().toISOString(),
        ...notification
      };
      mockNotifications.unshift(newNotification);
      // Show browser notification
      await showNotification(newNotification);
      return true;
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          status: 'unread'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return false;
      }

      // Show browser notification
      if (data) {
        await showNotification(data);
      }

      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  }
};