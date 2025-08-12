import { useState, useEffect } from 'react';
import { supabase, getCurrentUser, handleSupabaseError, uploadFile, getFileUrl, deleteFile, STORAGE_BUCKETS } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Document = Database['public']['Tables']['documents']['Row'];
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
type DocumentUpdate = Database['public']['Tables']['documents']['Update'];

interface DocumentWithDetails extends Document {
  aided_persons?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  appointments?: {
    id: string;
    title: string;
  };
  procedures?: {
    id: string;
    title: string;
  };
}

export const useDocuments = (aidedPersonId?: string) => {
  const [documents, setDocuments] = useState<DocumentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        setDocuments([]);
        return;
      }

      // Simplified query to avoid RLS issues
      let query = supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (aidedPersonId) {
        query = query.eq('aided_person_id', aidedPersonId);
      }

      const { data, error } = await query;
      if (error) throw error;

      setDocuments(data || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (
    file: File, 
    documentData: Omit<DocumentInsert, 'file_url' | 'uploaded_by' | 'file_type' | 'file_size'>
  ) => {
    try {
      setUploading(true);
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Validate file
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not supported');
      }

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload file to Supabase Storage
      await uploadFile(STORAGE_BUCKETS.DOCUMENTS, fileName, file);

      // Get public URL
      const fileUrl = getFileUrl(STORAGE_BUCKETS.DOCUMENTS, fileName);

      // Create document record
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...documentData,
          file_url: fileUrl,
          uploaded_by: user.id,
          file_type: file.type,
          file_size: file.size
        })
        .select('*')
        .single();

      if (error) throw error;

      await fetchDocuments();
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    } finally {
      setUploading(false);
    }
  };

  const updateDocument = async (id: string, updates: DocumentUpdate) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      await fetchDocuments();
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Delete document record
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchDocuments();
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const getDocumentsByCategory = async (category: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) return [];

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
      return data || [];
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const searchDocuments = async (searchTerm: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) return [];

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
      return data || [];
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const getExpiringDocuments = async (daysAhead = 30) => {
    try {
      const user = await getCurrentUser();
      if (!user) return [];

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
      return data || [];
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [aidedPersonId]);

  return {
    documents,
    loading,
    error,
    uploading,
    refetch: fetchDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument,
    getDocumentsByCategory,
    searchDocuments,
    getExpiringDocuments
  };
};