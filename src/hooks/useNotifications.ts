import { useState, useEffect } from 'react';
import { supabase, getCurrentUser, handleSupabaseError } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Notification = Database['public']['Tables']['notifications']['Row'];
type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const notificationList = data || [];
      setNotifications(notificationList);
      setUnreadCount(notificationList.filter(n => !n.read).length);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (notificationData: Omit<NotificationInsert, 'user_id'>) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notificationData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await fetchNotifications();
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchNotifications();
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const markAllAsRead = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      await fetchNotifications();
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchNotifications();
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const getNotificationsByType = async (type: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', type)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const scheduleNotification = async (
    notificationData: Omit<NotificationInsert, 'user_id'>,
    scheduledFor: Date
  ) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notificationData,
          user_id: user.id,
          scheduled_for: scheduledFor.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      await fetchNotifications();
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  // Real-time subscription for notifications
  useEffect(() => {
    const user = getCurrentUser();
    
    const subscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user?.then(u => u?.id)}`
        }, 
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    refetch: fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationsByType,
    scheduleNotification
  };
};