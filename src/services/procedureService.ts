import { supabase, getCurrentUser, hasPermission } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Procedure = Database['public']['Tables']['procedures']['Row'];
type ProcedureInsert = Database['public']['Tables']['procedures']['Insert'];
type ProcedureUpdate = Database['public']['Tables']['procedures']['Update'];
type ProcedureStep = Database['public']['Tables']['procedure_steps']['Row'];
type ProcedureStepInsert = Database['public']['Tables']['procedure_steps']['Insert'];
type ProcedureStepUpdate = Database['public']['Tables']['procedure_steps']['Update'];

export class ProcedureService {
  static async getProcedures(aidedPersonId?: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('procedures')
      .select(`
        *,
        aided_persons (
          id,
          first_name,
          last_name
        ),
        procedure_steps (
          id,
          title,
          description,
          step_order,
          completed,
          due_date,
          external_link,
          notes,
          completed_at,
          completed_by
        )
      `)
      .order('created_at', { ascending: false });

    if (aidedPersonId) {
      query = query.eq('aided_person_id', aidedPersonId);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Sort steps by order
    return data?.map(procedure => ({
      ...procedure,
      procedure_steps: procedure.procedure_steps?.sort((a, b) => a.step_order - b.step_order) || []
    }));
  }

  static async getActiveProcedures() {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('procedures')
      .select(`
        *,
        aided_persons (
          id,
          first_name,
          last_name
        ),
        procedure_steps (
          id,
          title,
          description,
          step_order,
          completed,
          due_date,
          external_link,
          notes
        )
      `)
      .eq('status', 'in_progress')
      .order('priority', { ascending: false })
      .order('due_date', { ascending: true });

    if (error) throw error;

    return data?.map(procedure => ({
      ...procedure,
      procedure_steps: procedure.procedure_steps?.sort((a, b) => a.step_order - b.step_order) || []
    }));
  }

  static async createProcedure(procedure: ProcedureInsert, steps: Omit<ProcedureStepInsert, 'procedure_id'>[]) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Check permissions
    if (procedure.aided_person_id) {
      const canWrite = await hasPermission(procedure.aided_person_id, 'contributeur');
      if (!canWrite) throw new Error('Insufficient permissions');
    }

    // Create procedure
    const { data: procedureData, error: procedureError } = await supabase
      .from('procedures')
      .insert({
        ...procedure,
        created_by: user.id
      })
      .select()
      .single();

    if (procedureError) throw procedureError;

    // Create steps
    if (steps.length > 0) {
      const stepsWithProcedureId = steps.map((step, index) => ({
        ...step,
        procedure_id: procedureData.id,
        step_order: index + 1
      }));

      const { data: stepsData, error: stepsError } = await supabase
        .from('procedure_steps')
        .insert(stepsWithProcedureId)
        .select();

      if (stepsError) throw stepsError;

      return {
        ...procedureData,
        procedure_steps: stepsData
      };
    }

    return procedureData;
  }

  static async updateProcedure(id: string, updates: ProcedureUpdate) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get the procedure to check permissions
    const { data: procedure } = await supabase
      .from('procedures')
      .select('aided_person_id')
      .eq('id', id)
      .single();

    if (procedure?.aided_person_id) {
      const canWrite = await hasPermission(procedure.aided_person_id, 'contributeur');
      if (!canWrite) throw new Error('Insufficient permissions');
    }

    const { data, error } = await supabase
      .from('procedures')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProcedure(id: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get the procedure to check permissions
    const { data: procedure } = await supabase
      .from('procedures')
      .select('aided_person_id')
      .eq('id', id)
      .single();

    if (procedure?.aided_person_id) {
      const canWrite = await hasPermission(procedure.aided_person_id, 'contributeur');
      if (!canWrite) throw new Error('Insufficient permissions');
    }

    const { error } = await supabase
      .from('procedures')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async updateStepCompletion(stepId: string, completed: boolean) {
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
    return data;
  }

  static async addStep(procedureId: string, step: Omit<ProcedureStepInsert, 'procedure_id' | 'step_order'>) {
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
    return data;
  }

  static async updateStep(stepId: string, updates: ProcedureStepUpdate) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('procedure_steps')
      .update(updates)
      .eq('id', stepId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteStep(stepId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('procedure_steps')
      .delete()
      .eq('id', stepId);

    if (error) throw error;
  }

  static async getProceduresByCategory(category: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('procedures')
      .select(`
        *,
        aided_persons (
          id,
          first_name,
          last_name
        ),
        procedure_steps (
          id,
          title,
          completed,
          step_order
        )
      `)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getOverdueProcedures() {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('procedures')
      .select(`
        *,
        aided_persons (
          id,
          first_name,
          last_name
        )
      `)
      .lt('due_date', today)
      .neq('status', 'completed')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  }
}