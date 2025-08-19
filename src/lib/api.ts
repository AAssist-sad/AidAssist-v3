import { supabase } from './supabase';
import type { AidedPerson, Appointment, Document, AdministrativeTask, SymptomSearch } from '../types';

export class APIClient {
  // Aided People Management
  static async getAidedPeople() {
    const { data, error } = await supabase
      .from('aided_people')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  }

  static async createAidedPerson(person: Omit<AidedPerson, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('aided_people')
      .insert(person)
      .select()
      .single();
    return { data, error };
  }

  static async updateAidedPerson(id: string, updates: Partial<AidedPerson>) {
    const { data, error } = await supabase
      .from('aided_people')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  // Appointments Management
  static async getAppointments(aidedPersonId?: string) {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        aided_people(full_name),
        documents(*)
      `)
      .order('appointment_date', { ascending: true });

    if (aidedPersonId) {
      query = query.eq('aided_person_id', aidedPersonId);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();
    return { data, error };
  }

  static async updateAppointment(id: string, updates: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  // Documents Management
  static async getDocuments(aidedPersonId?: string) {
    let query = supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (aidedPersonId) {
      query = query.eq('aided_person_id', aidedPersonId);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async uploadDocument(file: File, metadata: Omit<Document, 'id' | 'file_url' | 'file_size' | 'created_at' | 'updated_at'>) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) return { data: null, error: uploadError };

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    const documentData = {
      ...metadata,
      file_url: publicUrl,
      file_size: file.size,
      file_type: file.type
    };

    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single();

    return { data, error };
  }

  // Administrative Tasks
  static async getAdministrativeTasks(aidedPersonId?: string) {
    let query = supabase
      .from('administrative_tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (aidedPersonId) {
      query = query.eq('aided_person_id', aidedPersonId);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async createAdministrativeTask(task: Omit<AdministrativeTask, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('administrative_tasks')
      .insert(task)
      .select()
      .single();
    return { data, error };
  }

  // AI Medical Search
  static async searchSymptoms(query: string, aidedPersonId?: string) {
    const { data, error } = await supabase.functions.invoke('ai-medical-search', {
      body: { query, aided_person_id: aidedPersonId }
    });
    return { data, error };
  }

  // Notifications
  static async getNotifications() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    return { data, error };
  }

  static async markNotificationRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    return { data, error };
  }
}