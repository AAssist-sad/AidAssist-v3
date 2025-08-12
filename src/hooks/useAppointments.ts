import { useState, useEffect } from 'react';
import { supabase, getCurrentUser, handleSupabaseError } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { Appointment } from '../types';

type DbAppointmentRow = Database['public']['Tables']['appointments']['Row'];
type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];

interface AppointmentWithDetails extends Appointment {
  aided_persons?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

const transformDbAppointmentToFrontend = (dbRow: DbAppointmentRow): Appointment => {
  return {
    id: dbRow.id,
    title: dbRow.title,
    description: dbRow.description || undefined,
    date: new Date(dbRow.appointment_date),
    duration: dbRow.duration,
    location: dbRow.location,
    type: dbRow.type,
    aidedPersonId: dbRow.aided_person_id || '',
    accompaniedBy: dbRow.accompanied_by || undefined,
    documents: [],
    status: dbRow.status || 'scheduled',
    reminder: {
      enabled: dbRow.reminder_enabled || false,
      timeBeforeInMinutes: dbRow.reminder_minutes || 60
    },
    notes: dbRow.notes || undefined,
    doctorName: dbRow.doctor_name || undefined,
    specialty: dbRow.specialty || undefined,
    createdBy: dbRow.created_by || '',
    createdAt: new Date(dbRow.created_at),
    updatedAt: new Date(dbRow.updated_at)
  };
};

export const useAppointments = (aidedPersonId?: string) => {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        setAppointments([]);
        return;
      }

      // Simplified query to avoid RLS issues
      let query = supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (aidedPersonId) {
        query = query.eq('aided_person_id', aidedPersonId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const transformedData = (data || []).map(transformDbAppointmentToFrontend);
      setAppointments(transformedData);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingAppointments = async (limit = 10) => {
    try {
      const user = await getCurrentUser();
      if (!user) return [];

      // Simplified query to avoid RLS recursion
      const { data, error } = await supabase
        .from('appointments')
        .select('id, title, description, appointment_date, duration, location, type, aided_person_id, accompanied_by, doctor_name, specialty, status, reminder_enabled, reminder_minutes, notes, created_by, created_at, updated_at')
        .eq('created_by', user.id)
        .gte('appointment_date', new Date().toISOString())
        .eq('status', 'scheduled')
        .order('appointment_date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(transformDbAppointmentToFrontend);
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const createAppointment = async (appointmentData: Omit<AppointmentInsert, 'created_by'>) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          ...appointmentData,
          created_by: user.id
        })
        .select('*')
        .single();

      if (error) throw error;

      await fetchAppointments();
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const updateAppointment = async (id: string, updates: AppointmentUpdate) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      await fetchAppointments();
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchAppointments();
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const markCompleted = async (id: string, notes?: string) => {
    return updateAppointment(id, {
      status: 'completed',
      notes: notes || undefined
    });
  };

  const reschedule = async (id: string, newDate: string) => {
    return updateAppointment(id, {
      appointment_date: newDate,
      status: 'rescheduled'
    });
  };

  const cancel = async (id: string, reason?: string) => {
    return updateAppointment(id, {
      status: 'cancelled',
      notes: reason || undefined
    });
  };

  useEffect(() => {
    fetchAppointments();
  }, [aidedPersonId]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    getUpcomingAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    markCompleted,
    reschedule,
    cancel
  };
};