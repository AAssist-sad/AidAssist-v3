import React, { useState, useRef } from 'react';
import { Upload, File, Image, FileText, AlertCircle, CheckCircle, X, Cross as Progress } from 'lucide-react';
import { useStorage } from '../../hooks/useStorage';

interface FileUploadProps {
  onUploadComplete: (fileData: {
    path: string;
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }) => void;
  aidedPersonId: string;
  accept?: string;
  maxSize?: number;
  className?: string;
  children?: React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  aidedPersonId,
  accept = '.pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt',
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  children
}) => {
  const { uploadDocument, uploadProgress } = useStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setError(null);
      setSuccess(false);

      // Validate file size
      if (file.size > maxSize) {
        throw new Error(`Le fichier ne peut pas dépasser ${Math.round(maxSize / (1024 * 1024))} Mo`);
      }

      // Upload file
      const result = await uploadDocument(file, aidedPersonId);
      
      setSuccess(true);
      onUploadComplete(result);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléversement');
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-8 h-8 text-blue-600" />;
    if (file.type === 'application/pdf') return <FileText className="w-8 h-8 text-red-600" />;
    return <File className="w-8 h-8 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['o', 'Ko', 'Mo', 'Go'];
    if (bytes === 0) return '0 o';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : error 
            ? 'border-red-500 bg-red-50' 
            : success
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploadProgress.isUploading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
            <div>
              <p className="text-blue-700 font-medium">Téléversement en cours...</p>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
              <p className="text-sm text-blue-600 mt-1">{uploadProgress.progress}%</p>
            </div>
          </div>
        ) : success ? (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-green-700 font-medium">Fichier téléversé avec succès !</p>
            </div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-red-700 font-medium">Erreur de téléversement</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        ) : children ? (
          children
        ) : (
          <div className="space-y-4">
            <Upload className={`w-12 h-12 mx-auto ${
              dragActive ? 'text-blue-600' : 'text-gray-400'
            }`} />
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Glissez-déposez votre fichier ici
              </h4>
              <p className="text-gray-600 mb-4">
                ou cliquez pour sélectionner un fichier
              </p>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Parcourir les fichiers
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Formats supportés: PDF, JPG, PNG, GIF, DOC, DOCX, TXT (max {Math.round(maxSize / (1024 * 1024))} Mo)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
      />
    </div>
  );
};