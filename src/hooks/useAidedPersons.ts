import { useState, useEffect } from 'react';
import { supabase, getCurrentUser, handleSupabaseError } from '../lib/supabase';
import { Database } from '../lib/database.types';

type AidedPerson = Database['public']['Tables']['aided_persons']['Row'];
type AidedPersonInsert = Database['public']['Tables']['aided_persons']['Insert'];
type AidedPersonUpdate = Database['public']['Tables']['aided_persons']['Update'];

interface AidedPersonWithRole extends AidedPerson {
  role?: 'lecture' | 'contributeur' | 'admin';
}

export const useAidedPersons = () => {
  const [aidedPersons, setAidedPersons] = useState<AidedPersonWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAidedPersons = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        setAidedPersons([]);
        return;
      }

      // Direct query without joins to avoid RLS recursion
      const { data, error } = await supabase
        .from('aided_persons')
        .select('id, first_name, last_name, date_of_birth, relationship, medical_info, emergency_contact, address, social_security_number, created_by, created_at, updated_at')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAidedPersons(data || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const createAidedPerson = async (aidedPersonData: Omit<AidedPersonInsert, 'created_by'>) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Create aided person
      const { data: aidedPerson, error: aidedPersonError } = await supabase
        .from('aided_persons')
        .insert({
          ...aidedPersonData,
          created_by: user.id
        })
        .select()
        .single();

      if (aidedPersonError) throw aidedPersonError;

      await fetchAidedPersons();
      return aidedPerson;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const updateAidedPerson = async (id: string, updates: AidedPersonUpdate) => {
    try {
      const { data, error } = await supabase
        .from('aided_persons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchAidedPersons();
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const deleteAidedPerson = async (id: string) => {
    try {
      const { error } = await supabase
        .from('aided_persons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchAidedPersons();
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const inviteAidant = async (email: string, aidedPersonId: string, role: 'lecture' | 'contributeur' | 'admin') => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('invitations')
        .insert({
          email,
          aided_person_id: aidedPersonId,
          role,
          invited_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  useEffect(() => {
    fetchAidedPersons();
  }, []);

  return {
    aidedPersons,
    loading,
    error,
    refetch: fetchAidedPersons,
    createAidedPerson,
    updateAidedPerson,
    deleteAidedPerson,
    inviteAidant
  };
};