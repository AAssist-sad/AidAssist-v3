import React, { useState } from 'react';
import { X, User, Heart, Phone, MapPin, Shield, Save, AlertCircle, Calendar, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface NewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: any) => void;
}

export const NewProfileModal: React.FC<NewProfileModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
    dateOfBirth: '',
    medicalInfo: '',
    emergencyContact: '',
    address: '',
    socialSecurityNumber: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const relationships = [
    'Parent',
    'Enfant',
    'Conjoint(e)',
    'Frère/Sœur',
    'Grand-parent',
    'Petit-enfant',
    'Ami(e)',
    'Voisin(e)',
    'Autre'
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est obligatoire';
      if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est obligatoire';
      if (!formData.relationship) newErrors.relationship = 'La relation est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(1)) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Préparer les données pour la création d'une personne aidée
      const aidedPersonData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth || null,
        relationship: formData.relationship,
        medical_info: formData.medicalInfo || null,
        emergency_contact: formData.emergencyContact || null,
        address: formData.address || null,
        social_security_number: formData.socialSecurityNumber || null
      };

      onSave(aidedPersonData);
      handleClose();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Erreur lors de la création de la personne aidée' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      relationship: '',
      dateOfBirth: '',
      medicalInfo: '',
      emergencyContact: '',
      address: '',
      socialSecurityNumber: ''
    });
    setErrors({});
    setCurrentStep(1);
    setIsLoading(false);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Ajouter une personne</h2>
                <p className="text-blue-100">Créer le profil d'une personne que vous accompagnez</p>
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

        {/* Progress */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Étape {currentStep} sur 3</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Informations de la personne</h3>
                  <p className="text-gray-600">Complétez les informations de la personne que vous accompagnez</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Marie"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Dupont"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 md:col-span-2">
                      Relation avec cette personne *
                    </label>
                    <select
                      value={formData.relationship}
                      onChange={(e) => handleChange('relationship', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        errors.relationship ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionner...</option>
                      {relationships.map((rel) => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                    {errors.relationship && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.relationship}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Informations complémentaires</h3>
                  <p className="text-gray-600">Ajoutez des informations médicales et de contact (optionnel)</p>
                </div>

                <div className="space-y-6">
                  {/* Medical Information */}
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Informations médicales
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Informations médicales importantes
                        </label>
                        <textarea
                          value={formData.medicalInfo}
                          onChange={(e) => handleChange('medicalInfo', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="Allergies, traitements en cours, pathologies..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact d'urgence
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContact}
                          onChange={(e) => handleChange('emergencyContact', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="Dr. Martin - 01 23 45 67 89"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Adresse et sécurité sociale
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse complète
                        </label>
                        <textarea
                          value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="123 rue de la Paix, 75001 Paris"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de sécurité sociale
                        </label>
                        <input
                          type="text"
                          value={formData.socialSecurityNumber}
                          onChange={(e) => handleChange('socialSecurityNumber', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="1 23 45 67 890 123 45"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmation</h3>
                  <p className="text-gray-600">Vérifiez les informations avant de créer le profil</p>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Récapitulatif
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom complet :</span>
                      <span className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Relation :</span>
                      <span className="font-medium text-gray-900">{formData.relationship || 'Non spécifiée'}</span>
                    </div>
                    {formData.dateOfBirth && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date de naissance :</span>
                        <span className="font-medium text-gray-900">
                          {new Date(formData.dateOfBirth).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                    {formData.medicalInfo && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Infos médicales :</span>
                        <span className="font-medium text-gray-900">Renseignées</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {errors.submit}
                    </p>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {currentStep < 3 ? '* Champs obligatoires' : 'Vérifiez les informations avant de créer le profil'}
            </div>
            
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Précédent
                </button>
              )}
              
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Annuler
              </button>
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                  <Save className="w-4 h-4" />
                  )}
                  <span>Créer le profil</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};