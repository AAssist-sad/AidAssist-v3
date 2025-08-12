import { supabase, getCurrentUser, hasPermission } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Document = Database['public']['Tables']['documents']['Row'];
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
type DocumentUpdate = Database['public']['Tables']['documents']['Update'];

export class DocumentService {
  static async getDocuments(aidedPersonId?: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('documents')
      .select(`
        *,
        aided_persons (
          id,
          first_name,
          last_name
        ),
        appointments (
          id,
          title
        ),
        procedures (
          id,
          title
        )
      `)
      .order('uploaded_at', { ascending: false });

    if (aidedPersonId) {
      query = query.eq('aided_person_id', aidedPersonId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
  }

  static async getRecentDocuments(limit = 10) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        aided_persons (
          id,
          first_name,
          last_name
        )
      `)
      .order('uploaded_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async uploadDocument(file: File, documentData: Omit<DocumentInsert, 'file_url' | 'uploaded_by'>) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Check permissions
    if (documentData.aided_person_id) {
      const canWrite = await hasPermission(documentData.aided_person_id, 'contributeur');
      if (!canWrite) throw new Error('Insufficient permissions');
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Create document record
    const { data, error } = await supabase
      .from('documents')
      .insert({
        ...documentData,
        file_url: publicUrl,
        uploaded_by: user.id,
        file_type: file.type,
        file_size: file.size
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateDocument(id: string, updates: DocumentUpdate) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get the document to check permissions
    const { data: document } = await supabase
      .from('documents')
      .select('aided_person_id')
      .eq('id', id)
      .single();

    if (document?.aided_person_id) {
      const canWrite = await hasPermission(document.aided_person_id, 'contributeur');
      if (!canWrite) throw new Error('Insufficient permissions');
    }

    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteDocument(id: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get the document to check permissions and file path
    const { data: document } = await supabase
      .from('documents')
      .select('aided_person_id, file_url')
      .eq('id', id)
      .single();

    if (document?.aided_person_id) {
      const canWrite = await hasPermission(document.aided_person_id, 'contributeur');
      if (!canWrite) throw new Error('Insufficient permissions');
    }

    // Delete file from storage
    if (document?.file_url) {
      const filePath = document.file_url.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('documents')
          .remove([`${user.id}/${filePath}`]);
      }
    }

    // Delete document record
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getDocumentsByCategory(category: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        aided_persons (
          id,
          first_name,
          last_name
        )
      `)
      .eq('category', category)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async searchDocuments(searchTerm: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        aided_persons (
          id,
          first_name,
          last_name
        )
      `)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getExpiringDocuments(daysAhead = 30) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        aided_persons (
          id,
          first_name,
          last_name
        )
      `)
      .not('expiration_date', 'is', null)
      .lte('expiration_date', futureDate.toISOString().split('T')[0])
      .order('expiration_date', { ascending: true });

    if (error) throw error;
    return data;
  }
}