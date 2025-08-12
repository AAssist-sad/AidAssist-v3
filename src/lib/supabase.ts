import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'aidassist-web'
    }
  }
});

// Storage bucket names
export const STORAGE_BUCKETS = {
  DOCUMENTS: 'documents',
  AVATARS: 'avatars'
} as const;

// Helper functions for common operations
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// Storage helpers
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data;
};

export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};

// Real-time subscriptions
export const subscribeToTable = (
  table: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  let subscription = supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table,
        filter 
      }, 
      callback
    );

  return subscription.subscribe();
};

// Error handling helper
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  // Authentication errors
  if (error.message?.includes('Invalid login credentials')) {
    return 'Email ou mot de passe incorrect. Vérifiez vos identifiants.';
  }
  if (error.message?.includes('Email not confirmed') || error.code === 'email_not_confirmed') {
    return 'Veuillez confirmer votre email avant de vous connecter.';
  }
  if (error.message?.includes('User not found')) {
    return 'Aucun compte trouvé avec cette adresse email.';
  }
  if (error.message?.includes('Too many requests')) {
    return 'Trop de tentatives de connexion. Veuillez patienter quelques minutes.';
  }
  
  // Database errors
  if (error.code === 'PGRST301') {
    return 'Accès refusé. Vérifiez vos permissions.';
  }
  if (error.code === 'PGRST116') {
    return 'Aucun enregistrement trouvé.';
  }
  if (error.message?.includes('JWT')) {
    return 'Session expirée. Veuillez vous reconnecter.';
  }
  if (error.message?.includes('infinite recursion')) {
    return 'Erreur de configuration de sécurité. Contactez le support.';
  }
  
  return error.message || 'Une erreur est survenue.';
};