import { useState } from 'react';
import { supabase, uploadFile, getFileUrl, deleteFile, handleSupabaseError, STORAGE_BUCKETS } from '../lib/supabase';

interface UploadProgress {
  progress: number;
  isUploading: boolean;
}

export const useStorage = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    isUploading: false
  });

  const uploadDocument = async (
    file: File,
    aidedPersonId: string,
    onProgress?: (progress: number) => void
  ) => {
    try {
      setUploadProgress({ progress: 0, isUploading: true });

      // Validate file
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not supported');
      }

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${aidedPersonId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 100);

      // Upload file
      const uploadResult = await uploadFile(STORAGE_BUCKETS.DOCUMENTS, fileName, file);
      
      clearInterval(progressInterval);
      setUploadProgress({ progress: 100, isUploading: false });

      // Get public URL
      const fileUrl = getFileUrl(STORAGE_BUCKETS.DOCUMENTS, fileName);

      return {
        path: uploadResult.path,
        url: fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      };
    } catch (err) {
      setUploadProgress({ progress: 0, isUploading: false });
      throw new Error(handleSupabaseError(err));
    }
  };

  const uploadAvatar = async (file: File, userId: string) => {
    try {
      setUploadProgress({ progress: 0, isUploading: true });

      // Validate image
      const maxSize = 2 * 1024 * 1024; // 2MB for avatars
      if (file.size > maxSize) {
        throw new Error('Avatar size exceeds 2MB limit');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Avatar must be an image');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      // Delete existing avatar if any
      try {
        await deleteFile(STORAGE_BUCKETS.AVATARS, fileName);
      } catch (error) {
        // Ignore error if file doesn't exist
      }

      // Upload new avatar
      const uploadResult = await uploadFile(STORAGE_BUCKETS.AVATARS, fileName, file);
      
      setUploadProgress({ progress: 100, isUploading: false });

      // Get public URL
      const avatarUrl = getFileUrl(STORAGE_BUCKETS.AVATARS, fileName);

      return {
        path: uploadResult.path,
        url: avatarUrl
      };
    } catch (err) {
      setUploadProgress({ progress: 0, isUploading: false });
      throw new Error(handleSupabaseError(err));
    }
  };

  const deleteDocument = async (filePath: string) => {
    try {
      await deleteFile(STORAGE_BUCKETS.DOCUMENTS, filePath);
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const getSignedUrl = async (bucket: string, path: string, expiresIn = 3600) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;
      return data.signedUrl;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const downloadFile = async (bucket: string, path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  return {
    uploadProgress,
    uploadDocument,
    uploadAvatar,
    deleteDocument,
    getSignedUrl,
    downloadFile
  };
};