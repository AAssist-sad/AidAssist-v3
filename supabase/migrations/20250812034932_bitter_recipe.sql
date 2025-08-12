/*
  # Trigger de création automatique de profil

  1. Fonction
    - `create_profile_for_new_user()` - Fonction qui crée automatiquement un profil
    - Utilise les métadonnées de l'utilisateur pour peupler le profil
    - Gère les erreurs gracieusement

  2. Trigger
    - Se déclenche après l'insertion d'un nouvel utilisateur
    - Appelle la fonction de création de profil
    - Assure la cohérence des données
*/

-- Fonction pour créer automatiquement un profil pour un nouvel utilisateur
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    account_type,
    email_verified,
    preferences
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'account_type')::account_type, 'aidant'::account_type),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    '{"language": "fr", "notifications": {"push": true, "email": true, "reminders": true}}'::jsonb
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log l'erreur mais ne fait pas échouer l'inscription
    RAISE WARNING 'Erreur lors de la création du profil pour l''utilisateur %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui se déclenche après l'insertion d'un nouvel utilisateur
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_new_user();