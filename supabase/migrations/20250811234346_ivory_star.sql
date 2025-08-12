/*
  # Schema initial pour AidAssist

  1. Tables principales
    - `profiles` - Profils utilisateurs étendus
    - `aided_persons` - Personnes aidées
    - `appointments` - Rendez-vous
    - `documents` - Documents
    - `procedures` - Démarches administratives
    - `procedure_steps` - Étapes des démarches
    - `aidant_roles` - Rôles des aidants
    - `invitations` - Invitations d'aidants
    - `notifications` - Notifications
    - `audit_logs` - Logs d'audit

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques de sécurité par rôle
    - Audit trail complet

  3. Relations
    - Foreign keys avec contraintes
    - Index pour les performances
    - Triggers pour les timestamps
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE account_type AS ENUM ('aidant', 'proche_aide');
CREATE TYPE appointment_type AS ENUM ('consultation', 'hospital', 'teleconsultation', 'emergency', 'analysis', 'specialist');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'rescheduled');
CREATE TYPE document_category AS ENUM ('medical', 'administrative', 'insurance', 'identity', 'other');
CREATE TYPE procedure_category AS ENUM ('caf', 'ameli', 'cnav', 'prefecture', 'mdph', 'other');
CREATE TYPE procedure_status AS ENUM ('not_started', 'in_progress', 'completed', 'blocked');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE aidant_role AS ENUM ('lecture', 'contributeur', 'admin');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined', 'expired');
CREATE TYPE notification_type AS ENUM ('appointment', 'document', 'deadline', 'collaboration', 'reminder');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  account_type account_type NOT NULL DEFAULT 'aidant',
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{
    "language": "fr",
    "notifications": {
      "email": true,
      "push": true,
      "reminders": true
    }
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aided persons table
CREATE TABLE IF NOT EXISTS aided_persons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  relationship TEXT,
  medical_info TEXT,
  emergency_contact TEXT,
  address TEXT,
  social_security_number TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aidant roles table (many-to-many between profiles and aided_persons)
CREATE TABLE IF NOT EXISTS aidant_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aidant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  aided_person_id UUID REFERENCES aided_persons(id) ON DELETE CASCADE,
  role aidant_role NOT NULL DEFAULT 'contributeur',
  invited_by UUID REFERENCES profiles(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  status invitation_status DEFAULT 'accepted',
  UNIQUE(aidant_id, aided_person_id)
);

-- Invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  aided_person_id UUID REFERENCES aided_persons(id) ON DELETE CASCADE,
  role aidant_role NOT NULL DEFAULT 'contributeur',
  invited_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status invitation_status DEFAULT 'pending'
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  appointment_date TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30, -- in minutes
  location TEXT NOT NULL,
  type appointment_type NOT NULL DEFAULT 'consultation',
  aided_person_id UUID REFERENCES aided_persons(id) ON DELETE CASCADE,
  accompanied_by TEXT,
  doctor_name TEXT,
  specialty TEXT,
  status appointment_status DEFAULT 'scheduled',
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_minutes INTEGER DEFAULT 60,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  category document_category NOT NULL DEFAULT 'other',
  aided_person_id UUID REFERENCES aided_persons(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  procedure_id UUID REFERENCES procedures(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  description TEXT,
  expiration_date DATE,
  tags TEXT[] DEFAULT '{}',
  uploaded_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Procedures table
CREATE TABLE IF NOT EXISTS procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category procedure_category NOT NULL DEFAULT 'other',
  language TEXT DEFAULT 'fr',
  aided_person_id UUID REFERENCES aided_persons(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status procedure_status DEFAULT 'not_started',
  priority priority_level DEFAULT 'medium',
  due_date DATE,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Procedure steps table
CREATE TABLE IF NOT EXISTS procedure_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  procedure_id UUID REFERENCES procedures(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  step_order INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  external_link TEXT,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  priority priority_level DEFAULT 'medium',
  action_url TEXT,
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON profiles(account_type);
CREATE INDEX IF NOT EXISTS idx_aided_persons_created_by ON aided_persons(created_by);
CREATE INDEX IF NOT EXISTS idx_aidant_roles_aidant_id ON aidant_roles(aidant_id);
CREATE INDEX IF NOT EXISTS idx_aidant_roles_aided_person_id ON aidant_roles(aided_person_id);
CREATE INDEX IF NOT EXISTS idx_appointments_aided_person_id ON appointments(aided_person_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_documents_aided_person_id ON documents(aided_person_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_procedures_aided_person_id ON procedures(aided_person_id);
CREATE INDEX IF NOT EXISTS idx_procedures_status ON procedures(status);
CREATE INDEX IF NOT EXISTS idx_procedure_steps_procedure_id ON procedure_steps(procedure_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE aided_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE aidant_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedure_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for aided_persons
CREATE POLICY "Users can view aided persons they have access to"
  ON aided_persons FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM aidant_roles 
      WHERE aidant_id = auth.uid() 
      AND aided_person_id = aided_persons.id 
      AND status = 'accepted'
    )
  );

CREATE POLICY "Users can create aided persons"
  ON aided_persons FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can update aided persons"
  ON aided_persons FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM aidant_roles 
      WHERE aidant_id = auth.uid() 
      AND aided_person_id = aided_persons.id 
      AND role = 'admin' 
      AND status = 'accepted'
    )
  );

-- RLS Policies for aidant_roles
CREATE POLICY "Users can view their roles"
  ON aidant_roles FOR SELECT
  TO authenticated
  USING (aidant_id = auth.uid() OR invited_by = auth.uid());

CREATE POLICY "Admins can manage roles"
  ON aidant_roles FOR ALL
  TO authenticated
  USING (
    invited_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM aidant_roles ar2
      WHERE ar2.aidant_id = auth.uid() 
      AND ar2.aided_person_id = aidant_roles.aided_person_id 
      AND ar2.role = 'admin' 
      AND ar2.status = 'accepted'
    )
  );

-- RLS Policies for appointments
CREATE POLICY "Users can view appointments for their aided persons"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM aidant_roles 
      WHERE aidant_id = auth.uid() 
      AND aided_person_id = appointments.aided_person_id 
      AND status = 'accepted'
    )
  );

CREATE POLICY "Contributors can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM aidant_roles 
      WHERE aidant_id = auth.uid() 
      AND aided_person_id = appointments.aided_person_id 
      AND role IN ('contributeur', 'admin') 
      AND status = 'accepted'
    )
  );

CREATE POLICY "Contributors can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM aidant_roles 
      WHERE aidant_id = auth.uid() 
      AND aided_person_id = appointments.aided_person_id 
      AND role IN ('contributeur', 'admin') 
      AND status = 'accepted'
    )
  );

-- RLS Policies for documents
CREATE POLICY "Users can view documents for their aided persons"
  ON documents FOR SELECT
  TO authenticated
  USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM aidant_roles 
      WHERE aidant_id = auth.uid() 
      AND aided_person_id = documents.aided_person_id 
      AND status = 'accepted'
    )
  );

CREATE POLICY "Contributors can upload documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM aidant_roles 
      WHERE aidant_id = auth.uid() 
      AND aided_person_id = documents.aided_person_id 
      AND role IN ('contributeur', 'admin') 
      AND status = 'accepted'
    )
  );

-- RLS Policies for procedures
CREATE POLICY "Users can view procedures for their aided persons"
  ON procedures FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM aidant_roles 
      WHERE aidant_id = auth.uid() 
      AND aided_person_id = procedures.aided_person_id 
      AND status = 'accepted'
    )
  );

CREATE POLICY "Contributors can create procedures"
  ON procedures FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM aidant_roles 
      WHERE aidant_id = auth.uid() 
      AND aided_person_id = procedures.aided_person_id 
      AND role IN ('contributeur', 'admin') 
      AND status = 'accepted'
    )
  );

-- RLS Policies for procedure_steps
CREATE POLICY "Users can view procedure steps"
  ON procedure_steps FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM procedures p
      JOIN aidant_roles ar ON ar.aided_person_id = p.aided_person_id
      WHERE p.id = procedure_steps.procedure_id
      AND ar.aidant_id = auth.uid()
      AND ar.status = 'accepted'
    )
  );

CREATE POLICY "Contributors can update procedure steps"
  ON procedure_steps FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM procedures p
      JOIN aidant_roles ar ON ar.aided_person_id = p.aided_person_id
      WHERE p.id = procedure_steps.procedure_id
      AND ar.aidant_id = auth.uid()
      AND ar.role IN ('contributeur', 'admin')
      AND ar.status = 'accepted'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for audit_logs
CREATE POLICY "Users can view their audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aided_persons_updated_at BEFORE UPDATE ON aided_persons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_procedures_updated_at BEFORE UPDATE ON procedures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update procedure progress
CREATE OR REPLACE FUNCTION update_procedure_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_steps INTEGER;
  completed_steps INTEGER;
  new_progress INTEGER;
BEGIN
  -- Count total and completed steps for the procedure
  SELECT COUNT(*), COUNT(*) FILTER (WHERE completed = true)
  INTO total_steps, completed_steps
  FROM procedure_steps
  WHERE procedure_id = COALESCE(NEW.procedure_id, OLD.procedure_id);
  
  -- Calculate progress percentage
  IF total_steps > 0 THEN
    new_progress := ROUND((completed_steps::DECIMAL / total_steps) * 100);
  ELSE
    new_progress := 0;
  END IF;
  
  -- Update procedure progress
  UPDATE procedures 
  SET progress = new_progress,
      status = CASE 
        WHEN new_progress = 0 THEN 'not_started'
        WHEN new_progress = 100 THEN 'completed'
        ELSE 'in_progress'
      END
  WHERE id = COALESCE(NEW.procedure_id, OLD.procedure_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_procedure_progress_trigger
  AFTER INSERT OR UPDATE OR DELETE ON procedure_steps
  FOR EACH ROW EXECUTE FUNCTION update_procedure_progress();

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create audit triggers for important tables
CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_appointments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON appointments
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_documents_trigger
  AFTER INSERT OR UPDATE OR DELETE ON documents
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_procedures_trigger
  AFTER INSERT OR UPDATE OR DELETE ON procedures
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();