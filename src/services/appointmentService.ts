import { supabase, getCurrentUser, hasPermission } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Appointment = Database['public']['Tables']['appointments']['Row'];
type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];

export class AppointmentService {
  static async getAppointments(aidedPersonId?: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('appointments')
      .select(`
        *,
        aided_persons (
          id,
          first_name,
          last_name
        )
      `)
      .order('appointment_date', { ascending: true });

    if (aidedPersonId) {
      query = query.eq('aided_person_id', aidedPersonId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
  }

  static async getUpcomingAppointments(limit = 10) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        aided_persons (
          id,
          first_name,
          last_name
        )
      `)
      .gte('appointment_date', new Date().toISOString())
      .eq('status', 'scheduled')
      .order('appointment_date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async createAppointment(appointment: AppointmentInsert) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Check permissions
    if (appointment.aided_person_id) {
      const canWrite = await hasPermission(appointment.aided_person_id, 'contributeur');
      if (!canWrite) throw new Error('Insufficient permissions');
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        ...appointment,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAppointment(id: string, updates: AppointmentUpdate) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get the appointment to check permissions
    const { data: appointment } = await supabase
      .from('appointments')
      .select('aided_person_id')
      .eq('id', id)
      .single();

    if (appointment?.aided_person_id) {
      const canWrite = await hasPermission(appointment.aided_person_id, 'contributeur');
      if (!canWrite) throw new Error('Insufficient permissions');
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteAppointment(id: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get the appointment to check permissions
    const { data: appointment } = await supabase
      .from('appointments')
      .select('aided_person_id')
      .eq('id', id)
      .single();

    if (appointment?.aided_person_id) {
      const canWrite = await hasPermission(appointment.aided_person_id, 'contributeur');
      if (!canWrite) throw new Error('Insufficient permissions');
    }

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getAppointmentsByDateRange(startDate: Date, endDate: Date) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        aided_persons (
          id,
          first_name,
          last_name
        )
      `)
      .gte('appointment_date', startDate.toISOString())
      .lte('appointment_date', endDate.toISOString())
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async markAppointmentCompleted(id: string, notes?: string) {
    return this.updateAppointment(id, {
      status: 'completed',
      notes: notes || undefined
    });
  }

  static async rescheduleAppointment(id: string, newDate: Date) {
    return this.updateAppointment(id, {
      appointment_date: newDate.toISOString(),
      status: 'rescheduled'
    });
  }

  static async cancelAppointment(id: string, reason?: string) {
    return this.updateAppointment(id, {
      status: 'cancelled',
      notes: reason || undefined
    });
  }
}