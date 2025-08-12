/*
  # Fix RLS Policies and Infinite Recursion

  1. Security
    - Drop and recreate problematic RLS policies
    - Fix infinite recursion in aidant_roles policies
    - Simplify policy logic to avoid circular dependencies

  2. Changes
    - Remove recursive policy checks
    - Use direct user ID comparisons where possible
    - Separate policies for different operations
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage roles" ON aidant_roles;
DROP POLICY IF EXISTS "Contributors can update appointments" ON appointments;
DROP POLICY IF EXISTS "Contributors can update documents" ON documents;
DROP POLICY IF EXISTS "Contributors can update procedures" ON procedures;
DROP POLICY IF EXISTS "Contributors can manage procedure steps" ON procedure_steps;

-- Fix aidant_roles policies to avoid recursion
CREATE POLICY "Users can view their own roles"
  ON aidant_roles FOR SELECT
  TO authenticated
  USING (aidant_id = auth.uid());

CREATE POLICY "Users can view roles they invited"
  ON aidant_roles FOR SELECT
  TO authenticated
  USING (invited_by = auth.uid());

CREATE POLICY "Users can insert roles for their aided persons"
  ON aidant_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    invited_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM aided_persons 
      WHERE id = aided_person_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update roles they invited"
  ON aidant_roles FOR UPDATE
  TO authenticated
  USING (invited_by = auth.uid());

CREATE POLICY "Users can delete roles they invited"
  ON aidant_roles FOR DELETE
  TO authenticated
  USING (invited_by = auth.uid());

-- Fix appointments policies
CREATE POLICY "Contributors can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    aided_person_id IN (
      SELECT aided_person_id FROM aidant_roles 
      WHERE aidant_id = auth.uid() 
      AND role IN ('contributeur', 'admin') 
      AND status = 'accepted'
    )
  );

-- Fix documents policies
CREATE POLICY "Contributors can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    uploaded_by = auth.uid() OR
    aided_person_id IN (
      SELECT aided_person_id FROM aidant_roles 
      WHERE aidant_id = auth.uid() 
      AND role IN ('contributeur', 'admin') 
      AND status = 'accepted'
    )
  );

-- Fix procedures policies
CREATE POLICY "Contributors can update procedures"
  ON procedures FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    aided_person_id IN (
      SELECT aided_person_id FROM aidant_roles 
      WHERE aidant_id = auth.uid() 
      AND role IN ('contributeur', 'admin') 
      AND status = 'accepted'
    )
  );

-- Fix procedure_steps policies
CREATE POLICY "Contributors can manage procedure steps"
  ON procedure_steps FOR ALL
  TO authenticated
  USING (
    procedure_id IN (
      SELECT p.id FROM procedures p
      WHERE p.created_by = auth.uid() OR
      p.aided_person_id IN (
        SELECT aided_person_id FROM aidant_roles 
        WHERE aidant_id = auth.uid() 
        AND role IN ('contributeur', 'admin') 
        AND status = 'accepted'
      )
    )
  );

-- Add missing policies for invitations
CREATE POLICY "Users can view invitations they sent"
  ON invitations FOR SELECT
  TO authenticated
  USING (invited_by = auth.uid());

CREATE POLICY "Users can create invitations for their aided persons"
  ON invitations FOR INSERT
  TO authenticated
  WITH CHECK (
    invited_by = auth.uid() AND
    aided_person_id IN (
      SELECT id FROM aided_persons 
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update invitations they sent"
  ON invitations FOR UPDATE
  TO authenticated
  USING (invited_by = auth.uid());

-- Add missing policies for notifications
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add missing policies for audit_logs
CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Enable insert for authenticated users only on profiles
CREATE POLICY "Enable insert for authenticated users only"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);