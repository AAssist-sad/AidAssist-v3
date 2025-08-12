/*
  # Create Storage Buckets for AidAssist

  1. Storage Buckets
    - `documents` - For storing user documents (PDFs, images, etc.)
    - `avatars` - For storing user profile pictures

  2. Security Policies
    - Users can only access their own files
    - Authenticated users can upload files
    - File size and type restrictions
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'documents',
    'documents',
    true,
    10485760, -- 10MB
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  ),
  (
    'avatars',
    'avatars',
    true,
    2097152, -- 2MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  )
ON CONFLICT (id) DO NOTHING;

-- Documents bucket policies
CREATE POLICY "Users can view documents they have access to"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    (
      -- User owns the file (path starts with their user ID)
      (storage.foldername(name))[1] = auth.uid()::text OR
      -- User has access to the aided person's documents
      EXISTS (
        SELECT 1 FROM aidant_roles ar
        JOIN aided_persons ap ON ar.aided_person_id = ap.id
        WHERE ar.aidant_id = auth.uid()
        AND ar.status = 'accepted'
        AND (storage.foldername(name))[1] = ap.id::text
      )
    )
  );

CREATE POLICY "Users can upload documents for their aided persons"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    (
      -- User can upload to their own folder
      (storage.foldername(name))[1] = auth.uid()::text OR
      -- User can upload to aided person's folder if they have contributor+ role
      EXISTS (
        SELECT 1 FROM aidant_roles ar
        JOIN aided_persons ap ON ar.aided_person_id = ap.id
        WHERE ar.aidant_id = auth.uid()
        AND ar.status = 'accepted'
        AND ar.role IN ('contributeur', 'admin')
        AND (storage.foldername(name))[1] = ap.id::text
      )
    )
  );

CREATE POLICY "Users can update their own documents"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    (
      (storage.foldername(name))[1] = auth.uid()::text OR
      EXISTS (
        SELECT 1 FROM aidant_roles ar
        JOIN aided_persons ap ON ar.aided_person_id = ap.id
        WHERE ar.aidant_id = auth.uid()
        AND ar.status = 'accepted'
        AND ar.role IN ('contributeur', 'admin')
        AND (storage.foldername(name))[1] = ap.id::text
      )
    )
  );

CREATE POLICY "Users can delete their own documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    (
      (storage.foldername(name))[1] = auth.uid()::text OR
      EXISTS (
        SELECT 1 FROM aidant_roles ar
        JOIN aided_persons ap ON ar.aided_person_id = ap.id
        WHERE ar.aidant_id = auth.uid()
        AND ar.status = 'accepted'
        AND ar.role IN ('contributeur', 'admin')
        AND (storage.foldername(name))[1] = ap.id::text
      )
    )
  );

-- Avatars bucket policies
CREATE POLICY "Users can view all avatars"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );