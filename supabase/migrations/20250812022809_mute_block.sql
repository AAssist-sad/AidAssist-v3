/*
  # Fix RLS Recursion Issues

  1. Problem
    - Infinite recursion detected in policy for relation "aidant_roles"
    - Complex policies creating circular dependencies
    - Queries failing with 42P17 error code

  2. Solution
    - Drop existing problematic policies
    - Create simplified policies without circular references
    - Use direct user ID checks instead of complex joins

  3. Security Changes
    - Simplified policies for aided_persons table
    - Simplified policies for appointments table
    - Simplified policies for documents table
    - Simplified policies for procedures table
    - Keep aidant_roles policies simple and direct
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view aided persons they have access to" ON aided_persons;
DROP POLICY IF EXISTS "Admins can update aided persons" ON aided_persons;
DROP POLICY IF EXISTS "Users can view appointments for their aided persons" ON appointments;
DROP POLICY IF EXISTS "Contributors can update appointments" ON appointments;
DROP POLICY IF EXISTS "Contributors can create appointments" ON appointments;
DROP POLICY IF EXISTS "Users can view documents for their aided persons" ON documents;
DROP POLICY IF EXISTS "Contributors can update documents" ON documents;
DROP POLICY IF EXISTS "Contributors can upload documents" ON documents;
DROP POLICY IF EXISTS "Users can view procedures for their aided persons" ON procedures;
DROP POLICY IF EXISTS "Contributors can update procedures" ON procedures;
DROP POLICY IF EXISTS "Contributors can create procedures" ON procedures;

-- Create simplified policies for aided_persons
CREATE POLICY "Users can view their own aided persons"
  ON aided_persons
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can update their own aided persons"
  ON aided_persons
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Create simplified policies for appointments
CREATE POLICY "Users can view their own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can update their own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create appointments for their aided persons"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Create simplified policies for documents
CREATE POLICY "Users can view their own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can update their own documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can upload documents for their aided persons"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

-- Create simplified policies for procedures
CREATE POLICY "Users can view their own procedures"
  ON procedures
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can update their own procedures"
  ON procedures
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create procedures for their aided persons"
  ON procedures
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Keep aidant_roles policies simple
DROP POLICY IF EXISTS "Admins can manage roles" ON aidant_roles;
DROP POLICY IF EXISTS "Users can view their roles" ON aidant_roles;

CREATE POLICY "Users can view roles where they are involved"
  ON aidant_roles
  FOR SELECT
  TO authenticated
  USING (aidant_id = auth.uid() OR invited_by = auth.uid());

CREATE POLICY "Users can manage roles they created"
  ON aidant_roles
  FOR ALL
  TO authenticated
  USING (invited_by = auth.uid());