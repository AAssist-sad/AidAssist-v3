import { supabase } from '../lib/supabase';

// Real-time subscription manager
class RealtimeManager {
  private subscriptions: Map<string, any> = new Map();

  subscribe(
    channelName: string,
    table: string,
    callback: (payload: any) => void,
    filter?: string,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
  ) {
    // Unsubscribe existing subscription if any
    this.unsubscribe(channelName);

    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes', 
        { 
          event, 
          schema: 'public', 
          table,
          filter 
        }, 
        callback
      )
      .subscribe();

    this.subscriptions.set(channelName, subscription);
    return subscription;
  }

  unsubscribe(channelName: string) {
    const subscription = this.subscriptions.get(channelName);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(channelName);
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }
}

export const realtimeManager = new RealtimeManager();

// Specific subscription helpers
export const subscribeToUserNotifications = (userId: string, callback: (payload: any) => void) => {
  return realtimeManager.subscribe(
    'user_notifications',
    'notifications',
    callback,
    `user_id=eq.${userId}`
  );
};

export const subscribeToAidedPersonAppointments = (aidedPersonId: string, callback: (payload: any) => void) => {
  return realtimeManager.subscribe(
    'aided_person_appointments',
    'appointments',
    callback,
    `aided_person_id=eq.${aidedPersonId}`
  );
};

export const subscribeToAidedPersonDocuments = (aidedPersonId: string, callback: (payload: any) => void) => {
  return realtimeManager.subscribe(
    'aided_person_documents',
    'documents',
    callback,
    `aided_person_id=eq.${aidedPersonId}`
  );
};

export const subscribeToAidedPersonProcedures = (aidedPersonId: string, callback: (payload: any) => void) => {
  return realtimeManager.subscribe(
    'aided_person_procedures',
    'procedures',
    callback,
    `aided_person_id=eq.${aidedPersonId}`
  );
};

// Cleanup function for component unmount
export const cleanupRealtimeSubscriptions = () => {
  realtimeManager.unsubscribeAll();
};