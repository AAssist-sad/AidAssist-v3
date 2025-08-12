import { useState, useEffect } from 'react';
import { supabase, getCurrentUser, handleSupabaseError } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Procedure = Database['public']['Tables']['procedures']['Row'];
type ProcedureInsert = Database['public']['Tables']['procedures']['Insert'];
type ProcedureUpdate = Database['public']['Tables']['procedures']['Update'];
type ProcedureStep = Database['public']['Tables']['procedure_steps']['Row'];
type ProcedureStepInsert = Database['public']['Tables']['procedure_steps']['Insert'];
type ProcedureStepUpdate = Database['public']['Tables']['procedure_steps']['Update'];

interface ProcedureWithSteps extends Procedure {
  procedure_steps: ProcedureStep[];
  aided_persons?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export const useProcedures = (aidedPersonId?: string) => {
  const [procedures, setProcedures] = useState<ProcedureWithSteps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        setProcedures([]);
        return;
      }

      // Simplified query to avoid RLS issues
      let query = supabase
        .from('procedures')
        .select('*')
        .order('created_at', { ascending: false });

      if (aidedPersonId) {
        query = query.eq('aided_person_id', aidedPersonId);
      }

      const { data, error } = await query;
      if (error) throw error;

      setProcedures(data || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const getActiveProcedures = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) return [];

      // Simplified query to avoid RLS recursion
      const { data, error } = await supabase
        .from('procedures')
        .select('id, title, description, category, language, aided_person_id, progress, status, priority, due_date, created_by, created_at, updated_at')
        .eq('created_by', user.id)
        .eq('status', 'in_progress')
        .order('priority', { ascending: false })
        .order('due_date', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const createProcedure = async (
    procedureData: Omit<ProcedureInsert, 'created_by'>, 
    steps: Omit<ProcedureStepInsert, 'procedure_id' | 'step_order'>[]
  ) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Create procedure
      const { data: procedureResult, error: procedureError } = await supabase
        .from('procedures')
        .insert({
          ...procedureData,
          created_by: user.id
        })
        .select()
        .single();

      if (procedureError) throw procedureError;

      // Create steps
      if (steps.length > 0) {
        const stepsWithProcedureId = steps.map((step, index) => ({
          ...step,
          procedure_id: procedureResult.id,
          step_order: index + 1
        }));

        const { data: stepsData, error: stepsError } = await supabase
          .from('procedure_steps')
          .insert(stepsWithProcedureId)
          .select();

        if (stepsError) throw stepsError;
      }

      await fetchProcedures();
      return procedureResult;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const updateProcedure = async (id: string, updates: ProcedureUpdate) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('procedures')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchProcedures();
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const deleteProcedure = async (id: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('procedures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchProcedures();
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const updateStepCompletion = async (stepId: string, completed: boolean) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const updates: ProcedureStepUpdate = {
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        completed_by: completed ? user.id : null
      };

      const { data, error } = await supabase
        .from('procedure_steps')
        .update(updates)
        .eq('id', stepId)
        .select()
        .single();

      if (error) throw error;

      await fetchProcedures();
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const addStep = async (procedureId: string, step: Omit<ProcedureStepInsert, 'procedure_id' | 'step_order'>) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Get current max step order
      const { data: maxOrderData } = await supabase
        .from('procedure_steps')
        .select('step_order')
        .eq('procedure_id', procedureId)
        .order('step_order', { ascending: false })
        .limit(1)
        .single();

      const nextOrder = (maxOrderData?.step_order || 0) + 1;

      const { data, error } = await supabase
        .from('procedure_steps')
        .insert({
          ...step,
          procedure_id: procedureId,
          step_order: nextOrder
        })
        .select()
        .single();

      if (error) throw error;

      await fetchProcedures();
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const deleteStep = async (stepId: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('procedure_steps')
        .delete()
        .eq('id', stepId);

      if (error) throw error;

      await fetchProcedures();
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, [aidedPersonId]);

  return {
    procedures,
    loading,
    error,
    refetch: fetchProcedures,
    getActiveProcedures,
    createProcedure,
    updateProcedure,
    deleteProcedure,
    updateStepCompletion,
    addStep,
    deleteStep
  };
};