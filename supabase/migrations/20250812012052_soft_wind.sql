/*
  # Désactiver la confirmation email pour le développement

  1. Configuration
    - Désactive la confirmation email obligatoire
    - Permet la connexion immédiate après inscription
    - Configuration pour environnement de développement
*/

-- Cette migration doit être appliquée via le dashboard Supabase
-- Allez dans Authentication > Settings et désactivez "Enable email confirmations"

-- Alternativement, vous pouvez utiliser cette requête SQL dans l'éditeur SQL :
-- UPDATE auth.config SET email_confirm_required = false;

-- Note: Cette configuration est recommandée uniquement pour le développement
-- En production, gardez la confirmation email activée pour la sécurité