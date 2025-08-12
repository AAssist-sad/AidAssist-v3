import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Tag, Calendar, User, AlertCircle, Save, File, Image, FileCheck } from 'lucide-react';
import { Document } from '../../types';
import { AidedPerson } from '../../types';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: Omit<Document, 'id' | 'uploadedAt' | 'uploadedBy' | 'url'>) => void;
  aidedPersons: AidedPerson[];
}

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  aidedPersons
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'medical' as Document['category'],
    aidedPersonId: '1', // Mock - should be selected from user's aided persons
    description: '',
    expirationDate: '',
    tags: [] as string[],
    newTag: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'medical', label: 'Médical', icon: '🏥', color: 'bg-red-50 text-red-700 border-red-200' },
    { value: 'administrative', label: 'Administratif', icon: '📋', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'insurance', label: 'Assurance', icon: '🛡️', color: 'bg-green-50 text-green-700 border-green-200' },
    { value: 'identity', label: 'Identité', icon: '🆔', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'other', label: 'Autre', icon: '📄', color: 'bg-gray-50 text-gray-700 border-gray-200' }
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedFile) {
      newErrors.file = 'Veuillez sélectionner un fichier';
    } else {
      if (selectedFile.size > maxFileSize) {
        newErrors.file = 'Le fichier ne peut pas dépasser 10 Mo';
      }
      if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.file = 'Type de fichier non supporté';
      }
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du document est obligatoire';
    }

    if (formData.expirationDate) {
      const expDate = new Date(formData.expirationDate);
      const today = new Date();
      if (expDate <= today) {
        newErrors.expirationDate = 'La date d\'expiration doit être dans le futur';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (!formData.name) {
      // Auto-fill name from filename (without extension)
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({ ...prev, name: nameWithoutExt }));
    }
    
    // Clear file error if exists
    if (errors.file) {
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newDocument: Omit<Document, 'id' | 'uploadedAt' | 'uploadedBy' | 'url'> = {
      name: formData.name,
      type: selectedFile!.type,
      size: selectedFile!.size,
      category: formData.category,
      aidedPersonId: formData.aidedPersonId,
      description: formData.description || undefined,
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : undefined,
      tags: formData.tags
    };

    onSave(newDocument);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFormData({
      name: '',
      category: 'medical',
      aidedPersonId: aidedPersons.length > 0 ? aidedPersons[0].id : '',
      description: '',
      expirationDate: '',
      tags: [],
      newTag: ''
    });
    setErrors({});
    setDragActive(false);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-8 h-8 text-blue-600" />;
    if (file.type === 'application/pdf') return <FileText className="w-8 h-8 text-red-600" />;
    if (file.type.includes('word')) return <FileText className="w-8 h-8 text-blue-600" />;
    return <File className="w-8 h-8 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['o', 'Ko', 'Mo', 'Go'];
    if (bytes === 0) return '0 o';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Ajouter un document</h2>
                <p className="text-green-100">Téléverser et organiser vos fichiers importants</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="document-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* File Upload */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Sélection du fichier
              </h3>
              
              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-100' 
                      : errors.file 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${
                    dragActive ? 'text-blue-600' : 'text-gray-400'
                  }`} />
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
                    Formats supportés: PDF, JPG, PNG, GIF, DOC, DOCX, TXT (max 10 Mo)
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(selectedFile)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{selectedFile.name}</h4>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
                className="hidden"
              />

              {errors.file && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.file}
                </p>
              )}
            </div>

            {/* Document Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Informations du document
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du document *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Ordonnance Dr. Martin"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personne concernée
                  </label>
                  <select
                    value={formData.aidedPersonId}
                    onChange={(e) => handleChange('aidedPersonId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  >
                    {aidedPersons.length === 0 ? (
                      <option value="">Aucune personne aidée disponible</option>
                    ) : (
                      aidedPersons.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.firstName} {person.lastName}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder="Description du document, contexte, notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'expiration
                  </label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => handleChange('expirationDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ${
                      errors.expirationDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.expirationDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.expirationDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Étiquettes
              </h3>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.newTag}
                    onChange={(e) => handleChange('newTag', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder="Ajouter une étiquette..."
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Ajouter
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  <p className="mb-2">Suggestions d'étiquettes :</p>
                  <div className="flex flex-wrap gap-2">
                    {['ordonnance', 'analyse', 'radio', 'carte-vitale', 'mutuelle', 'urgence'].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          if (!formData.tags.includes(suggestion)) {
                            setFormData(prev => ({
                              ...prev,
                              tags: [...prev.tags, suggestion]
                            }));
                          }
                        }}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors duration-200"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              * Champs obligatoires
            </p>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="document-form"
                disabled={!selectedFile}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};